import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../src/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'hifz-super-secret-key-2026';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, action, name, subdomain } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let userObj: { id: string; email: string; name: string; role: string; tenantId: string } = {
      id: `user-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role: role || 'student',
      tenantId: 'tenant-al-furqan',
    };

    if (process.env.DATABASE_URL) {
      if (action === 'register') {
        // Register new user
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
        }

        let targetTenant = null;
        if (subdomain) {
          targetTenant = await prisma.tenant.findUnique({ where: { subdomain } });
        }
        if (!targetTenant) {
          targetTenant = await prisma.tenant.findFirst();
        }

        const passwordHash = await bcrypt.hash(password || 'Password123!', 10);
        const newUser = await prisma.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            passwordHash,
            role: role || 'student',
            tenantId: targetTenant ? targetTenant.id : 'tenant-al-furqan',
          },
        });

        userObj = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          tenantId: newUser.tenantId,
        };
      } else {
        // Login / authenticate
        const dbUser = await prisma.user.findUnique({
          where: { email },
          include: { tenant: true },
        });

        if (dbUser) {
          if (password && dbUser.passwordHash) {
            const isValid = await bcrypt.compare(password, dbUser.passwordHash);
            if (!isValid) {
              return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
            }
          }

          userObj = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            tenantId: dbUser.tenantId,
          };
        } else if (password) {
          return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }
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
    console.error('Authentication error:', error);
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
