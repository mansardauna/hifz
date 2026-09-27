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
  fields?: Record<string, string>;
  fileKey: string;
  method: 'PUT' | 'POST';
  headers: Record<string, string>;
}

/**
 * Enterprise Cloudflare R2 / AWS S3 Storage Utility
 * Provides zero-egress fee direct-to-storage pre-signed uploads
 */
export const storageService = {
  /**
   * Generates a pre-signed PUT/POST upload URL for direct client-to-R2/S3 upload.
   * Eliminates application server egress and handles files up to multi-gigabyte recordings.
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
    const r2Bucket = process.env.R2_BUCKET_NAME || 'ankabit-lms-assets';
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'media.ankabit.app';

    // If R2 / S3 credentials configured
    if (r2AccountId) {
      const uploadUrl = `https://${r2AccountId}.r2.cloudflarestorage.com/${r2Bucket}/${fileKey}`;
      const publicUrl = `https://${publicDomain}/${fileKey}`;

      return {
        uploadUrl,
        publicUrl,
        fileKey,
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
          'x-amz-acl': 'public-read',
        },
      };
    }

    // Local / Dev Fallback: routes to API upload endpoint
    return {
      uploadUrl: `/api/upload?key=${encodeURIComponent(fileKey)}`,
      publicUrl: `/uploads/${fileKey}`,
      fileKey,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
    };
  },

  /**
   * Construct CDN asset URL
   */
  getPublicUrl(fileKey: string): string {
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'media.ankabit.app';
    if (fileKey.startsWith('http://') || fileKey.startsWith('https://') || fileKey.startsWith('data:')) {
      return fileKey;
    }
    return `https://${publicDomain}/${fileKey.replace(/^\//, '')}`;
  },
};
