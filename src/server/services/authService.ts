import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'hifz-super-secret-key-2026';

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

export class AuthService {
  static async register(params: {
    email: string;
    password?: string;
    name?: string;
    role?: string;
    subdomain?: string;
  }): Promise<{ user: AuthUserPayload; token: string }> {
    const { email, password = 'Password123!', name, role = 'student', subdomain } = params;

    if (!email) {
      throw new Error('Email is required');
    }

    let userObj: AuthUserPayload;

    if (process.env.DATABASE_URL) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new Error('An account with this email already exists');
      }

      let targetTenant = null;
      if (subdomain) {
        targetTenant = await prisma.tenant.findUnique({ where: { subdomain } });
      }
      if (!targetTenant) {
        targetTenant = await prisma.tenant.findFirst();
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          passwordHash,
          role,
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
      userObj = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        role,
        tenantId: subdomain ? `tenant-${subdomain}` : 'tenant-al-furqan',
      };
    }

    const token = this.signToken(userObj);
    return { user: userObj, token };
  }

  static async authenticate(params: {
    email: string;
    password?: string;
    role?: string;
  }): Promise<{ user: AuthUserPayload; token: string }> {
    const { email, password, role = 'student' } = params;

    if (!email) {
      throw new Error('Email is required');
    }

    let userObj: AuthUserPayload;

    if (process.env.DATABASE_URL) {
      const dbUser = await prisma.user.findUnique({
        where: { email },
        include: { tenant: true },
      });

      if (!dbUser) {
        throw new Error('Account not found');
      }

      if (password && dbUser.passwordHash) {
        const isValid = await bcrypt.compare(password, dbUser.passwordHash);
        if (!isValid) {
          throw new Error('Invalid password');
        }
      }

      userObj = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        tenantId: dbUser.tenantId,
      };
    } else {
      // Mock Fallback
      userObj = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        tenantId: 'tenant-al-furqan',
      };
    }

    const token = this.signToken(userObj);
    return { user: userObj, token };
  }

  static signToken(user: AuthUserPayload): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): AuthUserPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        tenantId: decoded.tenantId,
      };
    } catch {
      return null;
    }
  }
}
