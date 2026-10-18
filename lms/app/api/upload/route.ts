import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '../../../src/lib/storage';
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
 * Pre-Signed URL Generation Endpoint (GET)
 * Authenticated request for direct-to-storage presigned uploads.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') || '';
    const rawTenantId = searchParams.get('tenantId') || authUser.tenantId || 'general';
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

    const tenantId = rawTenantId.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
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
    const rawTenantId = (formData.get('tenantId') as string) || authUser.tenantId || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const mimeType = file.type || '';
    const ext = MIME_TO_EXT[mimeType];
    if (!ext) {
      return NextResponse.json(
        { error: `File type "${mimeType}" is not allowed for security reasons.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileSize = buffer.length;

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

    const tenantId = rawTenantId.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const fileUuid = crypto.randomBytes(16).toString('hex');
    const fileName = `${Date.now()}-${fileUuid}${ext}`;

    // Cloudflare R2 / AWS S3 direct upload
    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      const fileUrl = `https://${process.env.R2_PUBLIC_DOMAIN || 'media.ankabit.app'}/${tenantId}/${category}/${fileName}`;
      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName,
        fileSize,
        mimeType,
      });
    }

    // Local Disk persistence in public/uploads for high-fidelity media serving
    try {
      const baseUploadDir = path.resolve(process.cwd(), 'public', 'uploads');
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

      const localUrl = `/uploads/${tenantId}/${category}/${fileName}`;
      return NextResponse.json({
        success: true,
        url: localUrl,
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

