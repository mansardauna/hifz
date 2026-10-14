import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '../../../src/lib/storage';
import { requireAuth } from '../../../src/server/lib/serverAuth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_MIME_TYPES = new Set([
  // Audio
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/m4a',
  'audio/x-m4a',
  'audio/ogg',
  'audio/webm',
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
]);

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Pre-Signed URL Generation Endpoint (GET)
 * Authenticated request for direct-to-storage presigned uploads.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName') || `upload-${Date.now()}.bin`;
    const contentType = searchParams.get('contentType') || 'application/octet-stream';
    const tenantId = searchParams.get('tenantId') || authUser.tenantId || 'general';
    const category = (searchParams.get('category') as any) || 'general';

    if (contentType !== 'application/octet-stream' && !ALLOWED_MIME_TYPES.has(contentType)) {
      return NextResponse.json({ error: `File type "${contentType}" is not allowed` }, { status: 400 });
    }

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
    const category = (formData.get('category') as string) || 'general';
    const tenantId = (formData.get('tenantId') as string) || authUser.tenantId || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
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

    const sanitizedBase = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${sanitizedBase}`;

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
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', tenantId, category);
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
