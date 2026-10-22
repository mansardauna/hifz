'use strict';

import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection, DatabaseEngine } from '../../../../src/server/lib/multiDbService';
import { prisma } from '../../../../src/lib/prisma';
import { getAuthenticatedUser } from '../../../../src/server/lib/serverAuth';

/**
 * POST /api/setup/test — Validates database credentials entered in the setup wizard
 * or SuperAdmin Database Settings (MySQL, PostgreSQL, Supabase).
 * Performs a live ping/query with 8s timeout without modifying database tables.
 */
export async function POST(request: NextRequest) {
  try {
    // Check if system is already installed
    let isInstalled = false;
    try {
      const superAdminCount = await prisma.user.count({ where: { role: 'superadmin' } });
      isInstalled = superAdminCount > 0;
    } catch (_e) {
      // Database not yet initialized or connected
    }

    if (isInstalled) {
      const authUser = getAuthenticatedUser(request);
      if (!authUser || authUser.role !== 'superadmin') {
        return NextResponse.json(
          { connected: false, error: 'Access denied: Re-testing database requires SuperAdmin privileges.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json().catch(() => ({}));
    const databaseType: DatabaseEngine = body.databaseType || 'mysql';

    if (!['mysql', 'postgres', 'supabase'].includes(databaseType)) {
      return NextResponse.json(
        { connected: false, error: 'Invalid database type. Must be mysql, postgres, or supabase.' },
        { status: 400 }
      );
    }

    const result = await testDatabaseConnection(databaseType, {
      mysql: body.mysql,
      postgres: body.postgres,
      supabase: body.supabase,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { connected: false, error: err?.message || 'Database connection test failed.' },
      { status: 500 }
    );
  }
}
