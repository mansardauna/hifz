import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../src/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'hifz-super-secret-key-2026';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let userObj: { id: string; email: string; name: string; role: string; tenantId: string } = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: role || 'student',
      tenantId: 'tenant-al-furqan',
    };

    if (process.env.DATABASE_URL) {
      const dbUser = await prisma.user.findUnique({
        where: { email },
        include: { tenant: true },
      });

      if (dbUser) {
        userObj = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          tenantId: dbUser.tenantId,
        };
      }
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        sub: userObj.id,
        email: userObj.email,
        name: userObj.name,
        role: userObj.role,
        tenantId: userObj.tenantId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      user: userObj,
      token,
    });

    // Set HTTP-Only Cookie for edge session security
    response.cookies.set('hifz_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
