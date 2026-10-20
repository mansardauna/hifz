import crypto from 'crypto';

export interface StorageUploadRequest {
  fileName: string;
  contentType: string;
  tenantId: string;
  category?: 'recitations' | 'assignments' | 'avatars' | 'certificates' | 'general';
  expiresInSeconds?: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  publicUrl: string;
  isPrivate: boolean;
  fields?: Record<string, string>;
  fileKey: string;
  method: 'PUT' | 'POST';
  headers: Record<string, string>;
}

export const PRIVATE_CATEGORIES = ['recitations', 'assignments'] as const;

function hmac(key: Buffer | string, value: string): Buffer {
  return crypto.createHmac('sha256', key).update(value, 'utf8').digest();
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function getSigV4SigningKey(secretKey: string, dateStamp: string, region: string, service: string): Buffer {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

/**
 * Enterprise Cloudflare R2 / AWS S3 Storage Utility
 * Provides cryptographic AWS SigV4 pre-signed uploads and downloads.
 * Protects private student recitations and assignments from unauthorized public exposure.
 */
export const storageService = {
  /**
   * Generates a cryptographically signed PUT URL using AWS Signature Version 4.
   */
  generatePresignedUploadUrl(params: StorageUploadRequest): PresignedUploadResponse {
    const {
      fileName,
      contentType,
      tenantId,
      category = 'general',
      expiresInSeconds = 3600,
    } = params;

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString('hex');
    const fileKey = `${tenantId}/${category}/${timestamp}-${randomHex}-${sanitizedName}`;

    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
    const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
    const r2Bucket = process.env.R2_BUCKET_NAME || 'ankabit-lms-assets';
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'media.ankabit.app';
    const region = process.env.R2_REGION || 'auto';

    // Categories that contain sensitive student PII or oral recordings
    const isPrivate = (PRIVATE_CATEGORIES as readonly string[]).includes(category);

    // If R2 / S3 credentials configured, sign with AWS SigV4
    if (r2AccountId && r2AccessKey && r2SecretKey) {
      const host = `${r2AccountId}.r2.cloudflarestorage.com`;
      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
      const dateStamp = amzDate.substring(0, 8);
      const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;

      // SigV4 Query Parameters
      const queryParams: Record<string, string> = {
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': `${r2AccessKey}/${credentialScope}`,
        'X-Amz-Date': amzDate,
        'X-Amz-Expires': String(expiresInSeconds),
        'X-Amz-SignedHeaders': 'content-type;host',
      };

      if (!isPrivate) {
        queryParams['x-amz-acl'] = 'public-read';
        queryParams['X-Amz-SignedHeaders'] = 'content-type;host;x-amz-acl';
      }

      // Canonical query string (alphabetically sorted)
      const sortedKeys = Object.keys(queryParams).sort();
      const canonicalQueryString = sortedKeys
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
        .join('&');

      // Canonical headers
      let canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`;
      let signedHeaders = 'content-type;host';
      if (!isPrivate) {
        canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-acl:public-read\n`;
        signedHeaders = 'content-type;host;x-amz-acl';
      }

      const canonicalURI = `/${r2Bucket}/${fileKey.split('/').map(encodeURIComponent).join('/')}`;
      const canonicalRequest = [
        'PUT',
        canonicalURI,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        'UNSIGNED-PAYLOAD',
      ].join('\n');

      const stringToSign = [
        'AWS4-HMAC-SHA256',
        amzDate,
        credentialScope,
        sha256Hex(canonicalRequest),
      ].join('\n');

      const signingKey = getSigV4SigningKey(r2SecretKey, dateStamp, region, 's3');
      const signature = hmac(signingKey, stringToSign).toString('hex');

      const uploadUrl = `https://${host}${canonicalURI}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
      const publicUrl = isPrivate
        ? `/api/media?key=${encodeURIComponent(fileKey)}`
        : `https://${publicDomain}/${fileKey}`;

      const headers: Record<string, string> = {
        'Content-Type': contentType,
      };
      if (!isPrivate) {
        headers['x-amz-acl'] = 'public-read';
      }

      return {
        uploadUrl,
        publicUrl,
        isPrivate,
        fileKey,
        method: 'PUT',
        headers,
      };
    }

    // Local / Dev Fallback: routes to API upload endpoint
    return {
      uploadUrl: `/api/upload?key=${encodeURIComponent(fileKey)}`,
      publicUrl: isPrivate
        ? `/api/media?key=${encodeURIComponent(fileKey)}`
        : `/uploads/${fileKey}`,
      isPrivate,
      fileKey,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
    };
  },

  /**
   * Generates a cryptographically signed GET URL for downloading private assets.
   * Access expires after the specified duration (default: 30 minutes / 1800s).
   */
  generatePresignedDownloadUrl(fileKey: string, expiresInSeconds = 1800): string {
    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
    const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
    const r2Bucket = process.env.R2_BUCKET_NAME || 'ankabit-lms-assets';
    const region = process.env.R2_REGION || 'auto';

    if (r2AccountId && r2AccessKey && r2SecretKey) {
      const host = `${r2AccountId}.r2.cloudflarestorage.com`;
      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
      const dateStamp = amzDate.substring(0, 8);
      const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;

      const queryParams: Record<string, string> = {
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': `${r2AccessKey}/${credentialScope}`,
        'X-Amz-Date': amzDate,
        'X-Amz-Expires': String(expiresInSeconds),
        'X-Amz-SignedHeaders': 'host',
      };

      const sortedKeys = Object.keys(queryParams).sort();
      const canonicalQueryString = sortedKeys
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
        .join('&');

      const canonicalHeaders = `host:${host}\n`;
      const signedHeaders = 'host';
      const canonicalURI = `/${r2Bucket}/${fileKey.split('/').map(encodeURIComponent).join('/')}`;

      const canonicalRequest = [
        'GET',
        canonicalURI,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        'UNSIGNED-PAYLOAD',
      ].join('\n');

      const stringToSign = [
        'AWS4-HMAC-SHA256',
        amzDate,
        credentialScope,
        sha256Hex(canonicalRequest),
      ].join('\n');

      const signingKey = getSigV4SigningKey(r2SecretKey, dateStamp, region, 's3');
      const signature = hmac(signingKey, stringToSign).toString('hex');

      return `https://${host}${canonicalURI}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
    }

    // Local / Dev Fallback: private files route through authorized media route
    const isPrivate = (PRIVATE_CATEGORIES as readonly string[]).some((cat) => fileKey.includes(`/${cat}/`));
    return isPrivate
      ? `/api/media?key=${encodeURIComponent(fileKey)}`
      : `/uploads/${fileKey}`;
  },

  /**
   * Construct CDN asset URL for public assets (logos, icons, public avatars)
   */
  getPublicUrl(fileKey: string): string {
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'media.ankabit.app';
    if (fileKey.startsWith('http://') || fileKey.startsWith('https://') || fileKey.startsWith('data:')) {
      return fileKey;
    }
    return `https://${publicDomain}/${fileKey.replace(/^\//, '')}`;
  },
};
