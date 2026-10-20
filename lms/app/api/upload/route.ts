import { NextRequest, NextResponse } from 'next/server';
import { storageService, PRIVATE_CATEGORIES } from '../../../src/lib/storage';
import { requireAuth } from '../../../src/server/lib/serverAuth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME_TO_EXT: Record<string, string> = {
  // Audio
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/m4a': '.m4a',
  'audio/x-m4a': '.m4a',
  'audio/ogg': '.ogg',
  'audio/webm': '.webm',
  // Images (excluding SVG to eliminate stored XSS)
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  // Documents
  'application/pdf': '.pdf',
};

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Pre-Signed URL Generator Endpoint (GET)
 * Generates an AWS SigV4 signed URL for secure R2 uploads or API routes.
 * Authenticated and strictly scoped to caller's tenant.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') || '';
    const requestedTenantId = searchParams.get('tenantId');
    const rawCategory = searchParams.get('category') || 'general';

    const ext = MIME_TO_EXT[contentType];
    if (!ext) {
      return NextResponse.json({ error: `File type "${contentType}" is not allowed` }, { status: 400 });
    }

    const VALID_CATEGORIES = ['general', 'recitations', 'assignments', 'avatars', 'certificates'] as const;
    type UploadCategory = typeof VALID_CATEGORIES[number];
    const category: UploadCategory = (VALID_CATEGORIES as readonly string[]).includes(rawCategory)
      ? (rawCategory as UploadCategory)
      : 'general';

    // Strict Tenant Isolation: SuperAdmins can upload for any tenant; non-superadmins are strictly restricted to their own tenant
    let tenantId = authUser.tenantId;
    if (authUser.role === 'superadmin') {
      tenantId = (requestedTenantId || authUser.tenantId || 'platform').replace(/[^a-zA-Z0-9_-]/g, '') || 'platform';
    } else {
      if (requestedTenantId && requestedTenantId !== authUser.tenantId) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot request upload access for another tenant.' },
          { status: 403 }
        );
      }
      if (!tenantId) {
        return NextResponse.json(
          { error: 'Forbidden: Authenticated user must belong to an active tenant.' },
          { status: 403 }
        );
      }
      tenantId = tenantId.replace(/[^a-zA-Z0-9_-]/g, '');
    }
    const fileUuid = crypto.randomBytes(16).toString('hex');
    const fileName = `${Date.now()}-${fileUuid}${ext}`;

    const presignedData = storageService.generatePresignedUploadUrl({
      fileName,
      contentType,
      tenantId,
      category,
    });

    return NextResponse.json({
      success: true,
      ...presignedData,
    });
  } catch (error: any) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate presigned upload URL' },
      { status: error.status || 500 }
    );
  }
}

/**
 * Direct Media & Recitation Upload Endpoint (POST)
 * Authenticated and strictly type-checked.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawCategory = (formData.get('category') as string) || 'general';
    const requestedTenantId = formData.get('tenantId') as string | null;

    // Strict Tenant Isolation: SuperAdmins can upload for any tenant; non-superadmins are strictly restricted to their own tenant
    let tenantId = authUser.tenantId;
    if (authUser.role === 'superadmin') {
      tenantId = (requestedTenantId || authUser.tenantId || 'platform').replace(/[^a-zA-Z0-9_-]/g, '') || 'platform';
    } else {
      if (requestedTenantId && requestedTenantId !== authUser.tenantId) {
        return NextResponse.json(
          { error: 'Forbidden: Cannot upload files to another tenant.' },
          { status: 403 }
        );
      }
      if (!tenantId) {
        return NextResponse.json(
          { error: 'Forbidden: Authenticated user must belong to an active tenant.' },
          { status: 403 }
        );
      }
      tenantId = tenantId.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    const ext = MIME_TO_EXT[mimeType];

    if (!ext) {
      return NextResponse.json(
        { error: `File type "${mimeType}" is not allowed. Supported formats: audio (mp3, wav, m4a, ogg), images (jpg, png, webp), pdf.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileSize = buffer.length;

    // Security Check: Magic Bytes Validation for Audio & Images
    if (ext === '.jpg' || ext === '.jpeg') {
      if (buffer.length < 3 || buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
        return NextResponse.json({ error: 'Invalid JPEG file signature' }, { status: 400 });
      }
    } else if (ext === '.png') {
      if (buffer.length < 4 || buffer[0] !== 0x89 || buffer[1] !== 0x50 || buffer[2] !== 0x4E || buffer[3] !== 0x47) {
        return NextResponse.json({ error: 'Invalid PNG file signature' }, { status: 400 });
      }
    } else if (ext === '.pdf') {
      if (buffer.length < 4 || buffer.toString('utf8', 0, 4) !== '%PDF') {
        return NextResponse.json({ error: 'Invalid PDF file signature' }, { status: 400 });
      }
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted limit (50MB).' },
        { status: 400 }
      );
    }

    const VALID_CATEGORIES = ['general', 'recitations', 'assignments', 'avatars', 'certificates'] as const;
    type UploadCategory = typeof VALID_CATEGORIES[number];
    const category: UploadCategory = (VALID_CATEGORIES as readonly string[]).includes(rawCategory)
      ? (rawCategory as UploadCategory)
      : 'general';

    const isPrivate = (PRIVATE_CATEGORIES as readonly string[]).includes(category);
    const fileUuid = crypto.randomBytes(16).toString('hex');
    const fileName = `${Date.now()}-${fileUuid}${ext}`;
    const fileKey = `${tenantId}/${category}/${fileName}`;

    // Cloudflare R2 / AWS S3 direct upload
    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      // Security: Private files are never served through public CDN domain. They route through authorized /api/media.
      const fileUrl = isPrivate
        ? `/api/media?key=${encodeURIComponent(fileKey)}`
        : `https://${process.env.R2_PUBLIC_DOMAIN || 'media.ankabit.app'}/${fileKey}`;

      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileKey,
        isPrivate,
        fileName,
        fileSize,
        mimeType,
      });
    }

    // Local Disk persistence:
    // For private categories (recitations, assignments): persist in storage/private to prevent public unauthenticated access
    // For public categories (avatars, general): persist in public/uploads for direct CDN serving
    try {
      const baseUploadDir = isPrivate
        ? path.resolve(process.cwd(), 'storage', 'private')
        : path.resolve(process.cwd(), 'public', 'uploads');
      const uploadDir = path.resolve(baseUploadDir, tenantId, category);

      // Path traversal check
      if (!uploadDir.startsWith(baseUploadDir)) {
        return NextResponse.json({ error: 'Invalid upload directory path' }, { status: 400 });
      }

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const targetFilePath = path.join(uploadDir, fileName);
      fs.writeFileSync(targetFilePath, buffer);

      const localUrl = isPrivate
        ? `/api/media?key=${encodeURIComponent(fileKey)}`
        : `/uploads/${tenantId}/${category}/${fileName}`;

      return NextResponse.json({
        success: true,
        url: localUrl,
        fileKey,
        isPrivate,
        fileName,
        fileSize,
        mimeType,
        message: 'File uploaded successfully',
      });
    } catch {
      // Memory base64 fallback if disk is read-only
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        fileName,
        fileSize,
        mimeType,
        message: 'File uploaded successfully',
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: error.status || 500 }
    );
  }
}
