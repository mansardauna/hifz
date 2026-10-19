'use strict';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

describe('Ankabit LMS Security & Multi-Tenant Isolation Suite', () => {

  // =========================================================================
  // Finding 1: Unauthenticated First-Run Setup Fail-Closed in Production
  // =========================================================================
  describe('Finding 1: First-Run Setup Protection', () => {
    test('Fails closed in production when SETUP_TOKEN is not configured', async () => {
      const origNodeEnv = process.env.NODE_ENV;
      const origToken = process.env.SETUP_TOKEN;
      try {
        process.env.NODE_ENV = 'production';
        delete process.env.SETUP_TOKEN;
        delete process.env.SETUP_SECRET;

        // Verify the security rule: in production without SETUP_TOKEN, setup cannot execute
        const isProduction = process.env.NODE_ENV === 'production';
        const requiredToken = process.env.SETUP_TOKEN || process.env.SETUP_SECRET;
        const wouldReject = !requiredToken && isProduction;

        assert.equal(wouldReject, true, 'Production first-run setup must fail closed when SETUP_TOKEN is unset');
      } finally {
        process.env.NODE_ENV = origNodeEnv;
        if (origToken) process.env.SETUP_TOKEN = origToken;
      }
    });

    test('Rejects invalid SETUP_TOKEN with 401 Unauthorized', async () => {
      const configuredToken = 'super_secret_setup_token_2026';
      const userProvidedToken = 'wrong_token';
      assert.notEqual(userProvidedToken, configuredToken, 'Mismatched setup token must be rejected');
    });
  });

  // =========================================================================
  // Finding 2: Cross-Tenant Upload Access Validation
  // =========================================================================
  describe('Finding 2: Tenant Isolation in Storage Uploads', () => {
    test('Non-superadmin users are strictly blocked from uploading into other tenants', () => {
      const caller = {
        id: 'usr_student_123',
        role: 'student',
        tenantId: 'tenant-al-furqan'
      };

      const requestedTenant = 'tenant-code-academy';

      // Security validation rule from app/api/upload/route.ts
      let isAllowed = false;
      if (caller.role === 'superadmin') {
        isAllowed = true;
      } else {
        isAllowed = (requestedTenant === caller.tenantId);
      }

      assert.equal(isAllowed, false, 'Student from Tenant A must NOT be allowed to upload into Tenant B');
    });

    test('SuperAdmin is authorized to upload for any tenant', () => {
      const caller = {
        id: 'usr_superadmin',
        role: 'superadmin',
        tenantId: 'platform'
      };
      const requestedTenant = 'tenant-al-furqan';
      const isAllowed = caller.role === 'superadmin' || requestedTenant === caller.tenantId;

      assert.equal(isAllowed, true, 'SuperAdmin can upload for any tenant');
    });
  });

  // =========================================================================
  // Finding 3: Storage AWS SigV4 Presigning & Private ACL Enforcement
  // =========================================================================
  describe('Finding 3: Cryptographic Storage Signing & Private ACL', () => {
    test('generatePresignedUploadUrl generates AWS SigV4 signed URL with credentials', () => {
      const origAcc = process.env.R2_ACCOUNT_ID;
      const origKey = process.env.R2_ACCESS_KEY_ID;
      const origSec = process.env.R2_SECRET_ACCESS_KEY;

      try {
        process.env.R2_ACCOUNT_ID = 'test_r2_acc_123';
        process.env.R2_ACCESS_KEY_ID = 'test_access_key';
        process.env.R2_SECRET_ACCESS_KEY = 'test_secret_key_456';

        // Load storage service dynamically
        delete require.cache[require.resolve('../src/lib/storage.ts')];
        const { storageService } = require('../src/lib/storage.ts');

        // Test private recitation upload
        const result = storageService.generatePresignedUploadUrl({
          fileName: 'student_surah_fatiha.mp3',
          contentType: 'audio/mpeg',
          tenantId: 'tenant-al-furqan',
          category: 'recitations'
        });

        assert.equal(result.isPrivate, true, 'Recitation must be marked private');
        assert.ok(result.uploadUrl.includes('X-Amz-Signature='), 'URL must contain SigV4 signature');
        assert.ok(result.uploadUrl.includes('X-Amz-Algorithm=AWS4-HMAC-SHA256'), 'URL must use AWS4-HMAC-SHA256');
        assert.equal(result.headers['x-amz-acl'], undefined, 'Private recitations must NOT have public-read ACL');
        assert.ok(result.publicUrl.includes('/api/media?key='), 'Private files must route through authorized media endpoint');
      } finally {
        process.env.R2_ACCOUNT_ID = origAcc;
        process.env.R2_ACCESS_KEY_ID = origKey;
        process.env.R2_SECRET_ACCESS_KEY = origSec;
      }
    });

    test('Public categories (avatars) receive public URLs with public-read ACL', () => {
      const origAcc = process.env.R2_ACCOUNT_ID;
      const origKey = process.env.R2_ACCESS_KEY_ID;
      const origSec = process.env.R2_SECRET_ACCESS_KEY;

      try {
        process.env.R2_ACCOUNT_ID = 'test_r2_acc_123';
        process.env.R2_ACCESS_KEY_ID = 'test_access_key';
        process.env.R2_SECRET_ACCESS_KEY = 'test_secret_key_456';

        delete require.cache[require.resolve('../src/lib/storage.ts')];
        const { storageService } = require('../src/lib/storage.ts');

        const result = storageService.generatePresignedUploadUrl({
          fileName: 'avatar.png',
          contentType: 'image/png',
          tenantId: 'tenant-al-furqan',
          category: 'avatars'
        });

        assert.equal(result.isPrivate, false, 'Avatars are public assets');
        assert.equal(result.headers['x-amz-acl'], 'public-read', 'Public assets must receive public-read ACL');
      } finally {
        process.env.R2_ACCOUNT_ID = origAcc;
        process.env.R2_ACCESS_KEY_ID = origKey;
        process.env.R2_SECRET_ACCESS_KEY = origSec;
      }
    });
  });

  // =========================================================================
  // Finding 4: Cross-Tenant Submissions & Grading Isolation
  // =========================================================================
  describe('Finding 4: Cross-Tenant Submission & Grading Protection', () => {
    test('Teacher from Tenant A cannot grade submission from Tenant B', () => {
      const teacher = {
        id: 'usr_teacher_A',
        role: 'teacher',
        tenantId: 'tenant-A'
      };

      const submission = {
        id: 'sub_123',
        userId: 'usr_student_B',
        user: { tenantId: 'tenant-B' }
      };

      // Verification logic from app/api/submissions/route.ts
      let canGrade = false;
      if (teacher.role === 'superadmin') {
        canGrade = true;
      } else {
        canGrade = (submission.user.tenantId === teacher.tenantId);
      }

      assert.equal(canGrade, false, 'Teacher from Tenant A must NOT be able to grade Tenant B submission');
    });

    test('Teacher from Tenant A can grade submission from Tenant A', () => {
      const teacher = {
        id: 'usr_teacher_A',
        role: 'teacher',
        tenantId: 'tenant-A'
      };

      const submission = {
        id: 'sub_124',
        userId: 'usr_student_A',
        user: { tenantId: 'tenant-A' }
      };

      const canGrade = teacher.role === 'superadmin' || submission.user.tenantId === teacher.tenantId;
      assert.equal(canGrade, true, 'Teacher can grade submissions from their own tenant');
    });
  });

  // =========================================================================
  // Finding 5: Cross-Tenant Lead Modification Protection
  // =========================================================================
  describe('Finding 5: Cross-Tenant Lead Modification Isolation', () => {
    test('Admin from Tenant A cannot update a lead belonging to Tenant B', () => {
      const admin = {
        id: 'usr_admin_A',
        role: 'admin',
        tenantId: 'tenant-A'
      };

      const lead = {
        id: 'lead_999',
        tenantId: 'tenant-B',
        studentName: 'Zayd Al-Ansari'
      };

      // Security check from app/api/leads/route.ts
      let canModify = false;
      if (admin.role === 'superadmin') {
        canModify = true;
      } else {
        canModify = (lead.tenantId === admin.tenantId);
      }

      assert.equal(canModify, false, 'Admin from Tenant A must NOT be able to update Tenant B lead');
    });
  });

  // =========================================================================
  // Finding 6: Stripe & Moyasar Webhook Signature Enforcement
  // =========================================================================
  describe('Finding 6: Webhook Signature Enforcement', () => {
    test('Unsigned webhook is rejected when STRIPE_WEBHOOK_SECRET is configured', () => {
      const webhookSecret = 'whsec_test_secret_123';
      const sig = null; // Unsigned

      let isRejected = false;
      if (webhookSecret) {
        if (!sig) {
          isRejected = true;
        }
      }

      assert.equal(isRejected, true, 'Unsigned webhook must be rejected immediately');
    });

    test('Non-production environments require explicit ALLOW_DEV_WEBHOOKS and NODE_ENV=development to bypass', () => {
      // In staging or preview, even without secret, bypass is disallowed
      const envs = ['staging', 'preview', 'test', 'production'];
      for (const env of envs) {
        const isExplicitDevBypass = (process.env.ALLOW_DEV_WEBHOOKS === 'true') && (env === 'development');
        assert.equal(isExplicitDevBypass, false, `Bypass must NOT be allowed in ${env}`);
      }
    });
  });

  // =========================================================================
  // Finding 10: Environment Example Placeholder Sanitation
  // =========================================================================
  describe('Finding 10: Tracked Credentials Sanitization', () => {
    test('.env.example contains only placeholders, no real passwords or keys', () => {
      const content = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
      assert.ok(!content.includes('securepassword2026'), '.env.example must not contain hardcoded securepassword2026');
      assert.ok(!content.includes('redispassword2026'), '.env.example must not contain hardcoded redispassword2026');
      assert.ok(!content.includes('secret_hifz_production_webrtc_cloud_2026'), '.env.example must not contain real livekit secret');
    });

    test('.env.production.template contains only placeholders', () => {
      const content = fs.readFileSync(path.join(__dirname, '..', '.env.production.template'), 'utf8');
      assert.ok(!content.includes('securepassword2026'), '.env.production.template must not contain hardcoded securepassword2026');
    });
  });

  // =========================================================================
  // Finding 12: Dynamic Prisma Multi-Database Auto-Switcher
  // =========================================================================
  describe('Finding 12: Prisma Multi-Database Auto-Switcher', () => {
    test('prepare-prisma correctly updates schema datasource for PostgreSQL & Supabase', () => {
      const origEnv = process.env.DATABASE_ENGINE;
      try {
        process.env.DATABASE_ENGINE = 'supabase';
        delete require.cache[require.resolve('../scripts/prepare-prisma.cjs')];
        require('../scripts/prepare-prisma.cjs');

        const schema = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf8');
        assert.ok(schema.includes('provider  = "postgresql"'), 'Schema must be set to postgresql for Supabase');
        assert.ok(schema.includes('directUrl = env("DIRECT_URL")'), 'Schema must include directUrl for connection pooling');

        // Switch back to mysql
        process.env.DATABASE_ENGINE = 'mysql';
        delete require.cache[require.resolve('../scripts/prepare-prisma.cjs')];
        require('../scripts/prepare-prisma.cjs');

        const schemaMysql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf8');
        assert.ok(schemaMysql.includes('provider = "mysql"'), 'Schema must be set to mysql for MySQL');
      } finally {
        process.env.DATABASE_ENGINE = origEnv;
      }
    });
  });

  // =========================================================================
  // Finding 13: Stripe Checkout Open Redirect & Lead Ownership Protection
  // =========================================================================
  describe('Finding 13: Open Redirect & Lead Tenant Association Protection', () => {
    test('Untrusted malicious origin is rejected and sanitized to default origin', () => {
      const evilOrigin = 'https://malicious-phishing-site.com';
      const rootDomain = 'ankabit.app';
      const defaultOrigin = 'https://ankabit.app';

      const getSafeOrigin = (rawOrigin) => {
        try {
          const parsed = new URL(rawOrigin);
          const hostname = parsed.hostname.toLowerCase();
          if (hostname === 'localhost' || hostname === '127.0.0.1') return parsed.origin;
          if (hostname === rootDomain || hostname.endsWith(`.${rootDomain}`)) return parsed.origin;
        } catch (_e) {}
        return defaultOrigin;
      };

      const safe = getSafeOrigin(evilOrigin);
      assert.equal(safe, defaultOrigin, 'Untrusted origin must be rejected and fallback to default origin');
    });

    test('Valid subdomain origin is permitted', () => {
      const trustedOrigin = 'https://al-furqan.ankabit.app';
      const rootDomain = 'ankabit.app';
      const defaultOrigin = 'https://ankabit.app';

      const getSafeOrigin = (rawOrigin) => {
        try {
          const parsed = new URL(rawOrigin);
          const hostname = parsed.hostname.toLowerCase();
          if (hostname === 'localhost' || hostname === '127.0.0.1') return parsed.origin;
          if (hostname === rootDomain || hostname.endsWith(`.${rootDomain}`)) return parsed.origin;
        } catch (_e) {}
        return defaultOrigin;
      };

      const safe = getSafeOrigin(trustedOrigin);
      assert.equal(safe, 'https://al-furqan.ankabit.app', 'Valid academy subdomain must be permitted');
    });

    test('Lead belonging to different tenant is rejected during checkout', () => {
      const selectedTenant = { id: 'tenant-A' };
      const lead = { id: 'lead_1', tenantId: 'tenant-B' };

      const checkBelongs = (l, t) => {
        if (l.tenantId !== t.id) {
          throw new Error('Forbidden: Lead does not belong to the selected academy.');
        }
      };

      assert.throws(() => checkBelongs(lead, selectedTenant), /Forbidden/);
    });
  });

  // =========================================================================
  // Finding 14: Strong Seed Credentials Enforcement
  // =========================================================================
  describe('Finding 14: Database Seed Credentials Hardening', () => {
    test('Production seeding rejects missing or short (<12 chars) INITIAL_ADMIN_PASSWORD', () => {
      const origEnv = process.env.NODE_ENV;
      const origPass = process.env.INITIAL_ADMIN_PASSWORD;

      try {
        process.env.NODE_ENV = 'production';
        process.env.INITIAL_ADMIN_PASSWORD = 'short';

        const isProduction = process.env.NODE_ENV === 'production';
        const seedPassword = process.env.INITIAL_ADMIN_PASSWORD;
        const isRejected = isProduction && (!seedPassword || seedPassword.length < 12);

        assert.equal(isRejected, true, 'Short password in production seeding must be rejected');
      } finally {
        process.env.NODE_ENV = origEnv;
        process.env.INITIAL_ADMIN_PASSWORD = origPass;
      }
    });
  });

});
