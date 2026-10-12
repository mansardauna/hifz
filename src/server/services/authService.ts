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
  tenantSubdomain?: string;
}

interface StoredUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  tenantId: string;
}

// In-memory verified credentials store with pre-hashed standard passwords
// Default password for pre-seeded platform accounts: 'Admin12345!'
const INITIAL_HASH = bcrypt.hashSync('Admin12345!', 10);

const MEMORY_USERS: Map<string, StoredUserRecord> = new Map([
  [
    'superadmin@ankabit.app',
    {
      id: 'usr-superadmin',
      email: 'superadmin@ankabit.app',
      name: 'Platform SuperAdmin',
      passwordHash: INITIAL_HASH,
      role: 'superadmin',
      tenantId: 'platform',
    },
  ],
  [
    'admin@hifz-academy.com',
    {
      id: 'usr-admin-hifz',
      email: 'admin@hifz-academy.com',
      name: 'Hifz Academy Director',
      passwordHash: INITIAL_HASH,
      role: 'admin',
      tenantId: 'tenant-hifz',
    },
  ],
  [
    'teacher@hifz-academy.com',
    {
      id: 'usr-teacher-hifz',
      email: 'teacher@hifz-academy.com',
      name: 'Sheikh Abdullah',
      passwordHash: INITIAL_HASH,
      role: 'teacher',
      tenantId: 'tenant-hifz',
    },
  ],
  [
    'student@hifz-academy.com',
    {
      id: 'usr-student-hifz',
      email: 'student@hifz-academy.com',
      name: 'Zayd Al-Mansoor',
      passwordHash: INITIAL_HASH,
      role: 'student',
      tenantId: 'tenant-hifz',
    },
  ],
]);

export class AuthService {
  static async register(params: {
    email: string;
    password?: string;
    name?: string;
    role?: string;
    subdomain?: string;
  }): Promise<{ user: AuthUserPayload; token: string }> {
    const { email, password, name, role = 'student', subdomain } = params;

    if (!email || !email.includes('@')) {
      throw new Error('A valid email address is required');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || normalizedEmail.split('@')[0];
    const passwordHash = await bcrypt.hash(password, 10);
    const targetTenantId = subdomain ? `tenant-${subdomain}` : 'tenant-hifz';

    // 1. Database Persistence
    if (process.env.DATABASE_URL) {
      try {
        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
          throw new Error('An account with this email address already exists');
        }

        let targetTenant = null;
        if (subdomain) {
          targetTenant = await prisma.tenant.findFirst({
            where: {
              OR: [
                { subdomain },
                { id: subdomain },
                { id: `tenant-${subdomain}` }
              ]
            }
          });
          if (!targetTenant) {
            targetTenant = await prisma.tenant.create({
              data: {
                name: subdomain.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                subdomain,
                niche: 'madrasat',
                brandColor: '#047857',
              },
            });
          }
        } else {
          targetTenant = await prisma.tenant.findFirst({ where: { subdomain: 'platform' } });
        }

        if (!targetTenant) {
          targetTenant = await prisma.tenant.create({
            data: {
              name: 'Autonomous Academy',
              subdomain: subdomain || `academy-${Date.now()}`,
              niche: 'madrasat',
              brandColor: '#047857',
            },
          });
        }

        const newUser = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: displayName,
            passwordHash,
            role,
            tenantId: targetTenant.id,
          },
        });

        const userObj: AuthUserPayload = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          tenantId: newUser.tenantId,
          tenantSubdomain: targetTenant?.subdomain || subdomain,
        };

        const token = this.signToken(userObj);
        return { user: userObj, token };
      } catch (err: any) {
        if (err.message.includes('already exists')) throw err;
        console.warn('Database register exception, saving to verified memory store:', err?.message);
      }
    }

    // 2. In-Memory Verified Store
    if (MEMORY_USERS.has(normalizedEmail)) {
      throw new Error('An account with this email address already exists');
    }

    const newRecord: StoredUserRecord = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      name: displayName,
      passwordHash,
      role,
      tenantId: targetTenantId,
    };

    MEMORY_USERS.set(normalizedEmail, newRecord);

    const userObj: AuthUserPayload = {
      id: newRecord.id,
      email: newRecord.email,
      name: newRecord.name,
      role: newRecord.role,
      tenantId: newRecord.tenantId,
      tenantSubdomain: subdomain,
    };

    const token = this.signToken(userObj);
    return { user: userObj, token };
  }

  static async authenticate(params: {
    email: string;
    password?: string;
    role?: string;
    subdomain?: string;
  }): Promise<{ user: AuthUserPayload; token: string }> {
    const { email, password, subdomain } = params;

    if (!email) {
      throw new Error('Email is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Database Authentication
    if (process.env.DATABASE_URL) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { tenant: true },
        });

        if (dbUser && dbUser.passwordHash) {
          const isValid = await bcrypt.compare(password, dbUser.passwordHash);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          // Strict Subdomain / Academy Workspace Verification
          if (subdomain && subdomain !== 'platform' && dbUser.role !== 'superadmin') {
            const cleanSub = subdomain.replace(/^tenant-/, '').toLowerCase();
            const targetTenant = await prisma.tenant.findFirst({
              where: {
                OR: [
                  { subdomain: cleanSub },
                  { id: subdomain },
                  { id: `tenant-${cleanSub}` }
                ]
              }
            });

            if (targetTenant) {
              if (dbUser.tenantId !== targetTenant.id) {
                const academyName = dbUser.tenant?.name || 'another academy';
                throw new Error(`This account belongs to ${academyName}. Please sign in at your assigned academy URL.`);
              }
            } else {
              if (dbUser.tenantId !== subdomain && dbUser.tenantId !== `tenant-${cleanSub}`) {
                const academyName = dbUser.tenant?.name || 'another academy';
                throw new Error(`This account belongs to ${academyName}. Please sign in at your assigned academy URL.`);
              }
            }
          }

          const userObj: AuthUserPayload = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            tenantId: dbUser.tenantId,
            tenantSubdomain: dbUser.tenant?.subdomain || (subdomain !== 'platform' ? subdomain : undefined),
          };

          return { user: userObj, token: this.signToken(userObj) };
        }
      } catch (err: any) {
        if (err.message === 'Invalid email or password' || err.message.includes('belongs to')) throw err;
        console.warn('Database authentication exception, checking memory store:', err?.message);
      }
    }

    // 2. Verified Memory Registry Authentication
    const memoryUser = MEMORY_USERS.get(normalizedEmail);
    if (!memoryUser) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, memoryUser.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Memory user workspace check
    if (subdomain && subdomain !== 'platform' && memoryUser.role !== 'superadmin') {
      const cleanSub = subdomain.replace(/^tenant-/, '').toLowerCase();
      const userTenant = memoryUser.tenantId.replace(/^tenant-/, '').toLowerCase();
      const isKnownMatch =
        (userTenant === 'hifz' && (cleanSub.includes('hifz') || cleanSub === 'demo' || cleanSub === 'sample-demo')) ||
        (userTenant === 'code' && cleanSub.includes('code')) ||
        (userTenant === 'alfurqan' && (cleanSub.includes('furqan') || cleanSub.includes('alfurqan'))) ||
        userTenant === cleanSub ||
        memoryUser.tenantId === subdomain ||
        memoryUser.tenantId === `tenant-${cleanSub}`;

      if (!isKnownMatch) {
        throw new Error('This account belongs to a different academy. Please sign in at your assigned academy URL.');
      }
    }

    const resolvedSub =
      subdomain && subdomain !== 'platform'
        ? subdomain
        : memoryUser.tenantId === 'tenant-hifz'
        ? 'hifz-academy'
        : memoryUser.tenantId === 'tenant-code'
        ? 'code-academy'
        : memoryUser.tenantId.replace(/^tenant-/, '');

    const userObj: AuthUserPayload = {
      id: memoryUser.id,
      email: memoryUser.email,
      name: memoryUser.name,
      role: memoryUser.role,
      tenantId: memoryUser.tenantId,
      tenantSubdomain: resolvedSub,
    };

    return { user: userObj, token: this.signToken(userObj) };
  }

  static signToken(user: AuthUserPayload): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantSubdomain: user.tenantSubdomain,
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
        tenantSubdomain: decoded.tenantSubdomain,
      };
    } catch {
      return null;
    }
  }
}
