import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAuthenticatedUser } from '../../../src/server/lib/serverAuth';
import { storageService, PRIVATE_CATEGORIES } from '../../../src/lib/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/media?key=<fileKey>
 * Protected Media Gateway & Streamer.
 * 
 * Enforces:
 * 1. Authentication for private categories (recitations, assignments).
 * 2. Multi-tenant isolation (non-superadmins can only access media from their own academy).
 * 3. Secure file delivery: AWS SigV4 presigned redirects for S3/R2 or private streaming for local disk.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Media key parameter is required' }, { status: 400 });
    }

    // Path sanitization: Prevent directory traversal
    const normalizedKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '').replace(/\\/g, '/');
    if (normalizedKey.includes('..') || normalizedKey.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid media key' }, { status: 400 });
    }

    const segments = normalizedKey.split('/').filter(Boolean);
    // Standard format: [tenantId, category, fileName]
    const fileTenant = segments[0] || '';
    const fileCategory = segments[1] || 'general';

    const isPrivate = (PRIVATE_CATEGORIES as readonly string[]).includes(fileCategory);

    // Authentication and tenant authorization check for private media
    if (isPrivate) {
      const authUser = getAuthenticatedUser(request);
      if (!authUser) {
        return NextResponse.json(
          { error: 'Authentication required. Please sign in to access private media.' },
          { status: 401 }
        );
      }

      // Tenant isolation: SuperAdmins have global access; teachers/students/admins restricted to their academy
      if (authUser.role !== 'superadmin') {
        const cleanSubdomain = (authUser.tenantSubdomain || '').toLowerCase();
        const userTenant = (authUser.tenantId || '').toLowerCase();
        const targetTenant = fileTenant.toLowerCase();

        const isAuthorizedTenant =
          userTenant === targetTenant ||
          targetTenant === `tenant-${cleanSubdomain}` ||
          targetTenant === cleanSubdomain;

        if (!isAuthorizedTenant) {
          return NextResponse.json(
            { error: 'Forbidden: You do not have permission to access private media belonging to another academy.' },
            { status: 403 }
          );
        }
      }
    }

    // 1. Cloudflare R2 / AWS S3 storage handling
    if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      if (isPrivate) {
        // Generate time-limited presigned GET URL (5 minutes)
        const presignedGetUrl = storageService.generatePresignedDownloadUrl(normalizedKey, 300);
        return NextResponse.redirect(presignedGetUrl, 307);
      } else {
        const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'media.liwanlms.com';
        return NextResponse.redirect(`https://${publicDomain}/${normalizedKey}`, 307);
      }
    }

    // 2. Local Disk media resolution
    // Check private storage directory first (storage/private), then public fallback
    const privateBase = path.resolve(process.cwd(), 'storage', 'private');
    const publicBase = path.resolve(process.cwd(), 'public', 'uploads');

    const privateFilePath = path.resolve(privateBase, normalizedKey);
    const publicFilePath = path.resolve(publicBase, normalizedKey);

    let resolvedPath: string | null = null;
    if (fs.existsSync(privateFilePath) && privateFilePath.startsWith(privateBase)) {
      resolvedPath = privateFilePath;
    } else if (fs.existsSync(publicFilePath) && publicFilePath.startsWith(publicBase)) {
      resolvedPath = publicFilePath;
    }

    if (!resolvedPath || !fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }

    const stat = fs.statSync(resolvedPath);
    const fileBuffer = fs.readFileSync(resolvedPath);

    // Resolve MIME content type
    const ext = path.extname(resolvedPath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.m4a': 'audio/mp4',
      '.ogg': 'audio/ogg',
      '.webm': 'audio/webm',
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
    };
    const contentType = mimeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': isPrivate ? 'private, no-cache, no-store, must-revalidate' : 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Media endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to serve media file' },
      { status: 500 }
    );
  }
}
