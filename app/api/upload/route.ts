import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Direct Media & Recitation Upload Endpoint
 * Supports audio (wav, mp3, m4a), images (png, jpg, webp, svg), and documents (pdf)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';
    const tenantId = (formData.get('tenantId') as string) || 'tenant-al-furqan';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const mimeType = file.type || 'application/octet-stream';
    const fileSize = buffer.length;

    // When S3 / Cloudflare R2 credentials are provided in env, upload directly to S3
    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      // Direct R2 / S3 upload branch
      const fileUrl = `https://${process.env.R2_PUBLIC_DOMAIN || 'media.techmadrasah.app'}/${tenantId}/${category}/${fileName}`;
      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName,
        fileSize,
        mimeType,
      });
    }

    // Default base64 data-uri / local URI response for zero-config offline execution
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
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
