'use strict';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma, reconfigurePrismaDatabase } from '../../../src/lib/prisma';
import {
  loadDatabaseConfig,
  saveDatabaseConfig,
  resetDatabaseConfigCache,
  buildDatabaseUrl,
  testDatabaseConnection,
  DatabaseEngine,
  DatabaseConfig,
} from '../../../src/server/lib/multiDbService';
import { getAuthenticatedUser } from '../../../src/server/lib/serverAuth';
import { AuthService } from '../../../src/server/services/authService';

let isSetupInProgress = false;

/**
 * GET /api/setup — Check system setup status, active database driver, and masked gateways
 */
export async function GET(request: NextRequest) {
  try {
    let superAdmin = null;
    let isDatabaseConnected = false;
    let tenantsCount = 0;

    try {
      superAdmin = await prisma.user.findFirst({
        where: { role: 'superadmin' },
        select: { id: true, email: true, name: true, role: true },
      });
      isDatabaseConnected = true;
      tenantsCount = await prisma.tenant.count();
    } catch (_e) {
      isDatabaseConnected = false;
    }

    const isInstalled = Boolean(superAdmin);

    // If installed, access to setup details requires SuperAdmin
    if (isInstalled) {
      const authUser = getAuthenticatedUser(request);
      if (!authUser || authUser.role !== 'superadmin') {
        return NextResponse.json(
          {
            isSetupCompleted: true,
            superAdminExists: true,
            isDatabaseConnected,
            error: 'System installation completed. Access restricted to SuperAdmin.',
          },
          { status: 403 }
        );
      }
    }

    const activeDbConfig = await loadDatabaseConfig();

    return NextResponse.json({
      isDatabaseConnected,
      isSetupCompleted: isInstalled,
      superAdminExists: isInstalled,
      superAdminEmail: superAdmin?.email || '',
      databaseConfig: {
        engine: activeDbConfig?.engine || 'mysql',
        mysql: {
          host: activeDbConfig?.mysql?.host || 'localhost',
          port: activeDbConfig?.mysql?.port || 3306,
          database: activeDbConfig?.mysql?.database || 'ankabit_lms',
          user: activeDbConfig?.mysql?.user || 'root',
        },
        postgres: {
          host: activeDbConfig?.postgres?.host || 'localhost',
          port: activeDbConfig?.postgres?.port || 5432,
          database: activeDbConfig?.postgres?.database || 'postgres',
          user: activeDbConfig?.postgres?.user || 'postgres',
        },
        supabase: {
          url: activeDbConfig?.supabase?.url || '',
        },
      },
      gateways: {
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
        moyasarConfigured: Boolean(process.env.MOYASAR_SECRET_KEY),
        resendConfigured: Boolean(process.env.RESEND_API_KEY),
      },
      tenantsCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        isDatabaseConnected: false,
        isSetupCompleted: false,
        error: err?.message || 'Failed to inspect system status.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/setup — Execute system setup, database engine provisioning, and SuperAdmin creation
 */
export async function POST(request: NextRequest) {
  if (isSetupInProgress) {
    return NextResponse.json(
      { error: 'System setup is already in progress. Please wait for completion.' },
      { status: 409 }
    );
  }

  isSetupInProgress = true;

  try {
    let superAdmin = null;
    try {
      superAdmin = await prisma.user.findFirst({ where: { role: 'superadmin' } });
    } catch (_e) {}

    const isInstalled = Boolean(superAdmin);

    // Re-run protection: once installed, only authenticated SuperAdmin can reconfigure
    if (isInstalled) {
      const authUser = getAuthenticatedUser(request);
      if (!authUser || authUser.role !== 'superadmin') {
        return NextResponse.json(
          { error: 'Setup is permanently locked. Only authenticated SuperAdmin may reconfigure system settings.' },
          { status: 403 }
        );
      }
    } else {
      // First-run protection: In production, fail closed if SETUP_TOKEN or SETUP_SECRET is unset.
      const isProduction = process.env.NODE_ENV === 'production';
      const requiredToken = process.env.SETUP_TOKEN || process.env.SETUP_SECRET;

      if (!requiredToken && isProduction) {
        return NextResponse.json(
          {
            error:
              'Security Error: In production, SETUP_TOKEN or SETUP_SECRET must be configured in environment variables to initialize the platform.',
          },
          { status: 403 }
        );
      }

      if (requiredToken) {
        const headerToken = request.headers.get('x-setup-token');
        const urlToken = new URL(request.url).searchParams.get('token');
        const bodyClone = await request.clone().json().catch(() => ({}));
        const providedToken = headerToken || urlToken || bodyClone?.setupToken;

        if (!providedToken || providedToken !== requiredToken) {
          return NextResponse.json(
            { error: 'Unauthorized: Invalid or missing SETUP_TOKEN.' },
            { status: 401 }
          );
        }
      }
    }

    const body = await request.json();

    const {
      databaseType = 'mysql',
      mysqlHost = 'localhost',
      mysqlPort = 3306,
      mysqlDatabase = 'ankabit_lms',
      mysqlUser = 'root',
      mysqlPassword = '',
      postgresHost = 'localhost',
      postgresPort = 5432,
      postgresDb = 'postgres',
      postgresUser = 'postgres',
      postgresPassword = '',
      supabaseUrl = '',
      supabaseAnonKey = '',
      supabaseServiceRoleKey = '',
      superAdminEmail,
      superAdminPassword,
      superAdminName = 'Super Administrator',
      platformName = 'Ankabit LMS',
      currency = 'USD',
    } = body;

    if (!isInstalled && (!superAdminEmail || !superAdminPassword)) {
      return NextResponse.json(
        { error: 'Super Admin Email and Password are required to complete installation.' },
        { status: 400 }
      );
    }

    if (!isInstalled && superAdminPassword.length < 8) {
      return NextResponse.json(
        { error: 'Super Admin Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const engine: DatabaseEngine = ['mysql', 'postgres', 'supabase'].includes(databaseType)
      ? (databaseType as DatabaseEngine)
      : 'mysql';

    // 1. Verify connection against the chosen database engine
    const testResult = await testDatabaseConnection(engine, {
      mysql: {
        host: mysqlHost.trim(),
        port: Number(mysqlPort),
        database: mysqlDatabase.trim(),
        user: mysqlUser.trim(),
        password: mysqlPassword || '',
      },
      postgres: {
        host: postgresHost.trim(),
        port: Number(postgresPort),
        database: postgresDb.trim(),
        user: postgresUser.trim(),
        password: postgresPassword || '',
      },
      supabase: {
        url: supabaseUrl.trim(),
        anonKey: supabaseAnonKey.trim(),
        serviceRoleKey: supabaseServiceRoleKey.trim(),
      },
    });

    if (!testResult.connected) {
      return NextResponse.json(
        { error: `Database connection test failed: ${testResult.error || testResult.message}` },
        { status: 400 }
      );
    }

    // 2. Persist Database Configuration to data/database.config.json
    const dbConfig: DatabaseConfig = {
      engine,
      mysql: {
        host: mysqlHost.trim(),
        port: Number(mysqlPort),
        database: mysqlDatabase.trim(),
        user: mysqlUser.trim(),
        password: mysqlPassword || '',
      },
      postgres: {
        host: postgresHost.trim(),
        port: Number(postgresPort),
        database: postgresDb.trim(),
        user: postgresUser.trim(),
        password: postgresPassword || '',
      },
      supabase: {
        url: supabaseUrl.trim(),
        anonKey: supabaseAnonKey.trim(),
        serviceRoleKey: supabaseServiceRoleKey.trim(),
      },
    };

    await saveDatabaseConfig(dbConfig);
    resetDatabaseConfigCache();

    // 3. Dynamically reconfigure Prisma Client to use the new database connection
    const newDatabaseUrl = buildDatabaseUrl(dbConfig);
    const activePrisma = await reconfigurePrismaDatabase(newDatabaseUrl);

    // 4. Ensure platform tenant exists and create or update Super Admin account
    let createdAdmin: any = null;
    const cleanEmail = superAdminEmail ? superAdminEmail.trim().toLowerCase() : (superAdmin?.email || 'admin@ankabit.com');

    const platformTenant = await activePrisma.tenant.upsert({
      where: { subdomain: 'platform' },
      update: {
        name: platformName || 'Ankabit Platform Operations',
      },
      create: {
        name: platformName || 'Ankabit Platform Operations',
        subdomain: 'platform',
        niche: 'superadmin',
        brandColor: '#0f766e',
      },
    });

    if (superAdminPassword) {
      const passwordHash = await bcrypt.hash(superAdminPassword, 10);
      createdAdmin = await activePrisma.user.upsert({
        where: { email: cleanEmail },
        update: {
          role: 'superadmin',
          passwordHash,
          name: superAdminName || 'Platform SuperAdmin',
          tenantId: platformTenant.id,
        },
        create: {
          email: cleanEmail,
          passwordHash,
          name: superAdminName || 'Platform SuperAdmin',
          role: 'superadmin',
          tenantId: platformTenant.id,
        },
      });
    }

    // 5. Generate signed JWT session for SuperAdmin
    const token = AuthService.signToken({
      id: createdAdmin?.id || superAdmin?.id || 'superadmin-master',
      role: 'superadmin',
      email: cleanEmail,
      name: superAdminName || 'Platform SuperAdmin',
      tenantId: platformTenant.id,
      tenantSubdomain: 'platform',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Platform Installation & Multi-Database Setup Completed Successfully!',
      superAdminEmail: cleanEmail,
      databaseEngine: engine,
      loginUrl: '/login',
      dashboardUrl: '/super-admin',
    });

    response.cookies.set('ankabit_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set('hifz_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error during system setup.' },
      { status: 500 }
    );
  } finally {
    isSetupInProgress = false;
  }
}
