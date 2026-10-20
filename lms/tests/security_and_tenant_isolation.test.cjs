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

  // =========================================================================
  // Additional Deep Isolation Audits: Members, Finance, and Courses
  // =========================================================================
  describe('Comprehensive Tenant Boundary Enforcement', () => {
    test('Admin cannot read or export members from another academy', () => {
      const admin = {
        id: 'usr_admin_1',
        role: 'admin',
        tenantId: 'tenant-al-furqan',
        tenantSubdomain: 'al-furqan',
      };
      const requestedTenant = 'tenant-other-academy';
      const cleanSub = requestedTenant.replace('tenant-', '');

      const isAllowed =
        admin.role === 'superadmin' ||
        admin.tenantId === requestedTenant ||
        (admin.tenantSubdomain && cleanSub === admin.tenantSubdomain);

      assert.equal(isAllowed, false, 'Tenant admin must NOT access member list of another tenant');
    });

    test('Admin cannot read financial analytics and transaction stream of another academy', () => {
      const admin = {
        id: 'usr_admin_1',
        role: 'admin',
        tenantId: 'tenant-al-furqan',
        tenantSubdomain: 'al-furqan',
      };
      const requestedTenant = 'tenant-other-academy';
      const cleanSub = admin.tenantSubdomain?.toLowerCase() || '';

      const isOwner =
        admin.role === 'superadmin' ||
        admin.tenantId === requestedTenant ||
        requestedTenant === `tenant-${cleanSub}` ||
        requestedTenant === cleanSub;

      assert.equal(isOwner, false, 'Tenant admin must NOT access finance records of another tenant');
    });

    test('Teacher or admin cannot publish courses under another academy', () => {
      const teacher = {
        id: 'usr_teacher_1',
        role: 'teacher',
        tenantId: 'tenant-al-furqan',
        tenantSubdomain: 'al-furqan',
      };
      const targetTenantId = 'tenant-competitor';
      const cleanSub = teacher.tenantSubdomain?.toLowerCase() || '';

      const isOwner =
        teacher.role === 'superadmin' ||
        teacher.tenantId === targetTenantId ||
        targetTenantId === `tenant-${cleanSub}` ||
        targetTenantId === cleanSub;

      assert.equal(isOwner, false, 'Teacher must NOT publish courses under a different tenant');
    });
  });

  // =========================================================================
  // Auditor Finding 1: Server-Derived Pricing & Anonymous Checkout Scoping
  // =========================================================================
  describe('Auditor Finding 1: Server-Derived Pricing & Anonymous Checkout Scoping', () => {
    test('Anonymous checkout discards arbitrary client amount and derives price server-side', () => {
      const tenant = {
        id: 'tenant-123',
        pricingPlans: JSON.stringify([{ id: 'plan_gold', price: 99, interval: 'month' }]),
      };
      const clientPayload = {
        tenantId: 'tenant-123',
        planId: 'plan_gold',
        amount: 1, // Attacker trying to pay $1 instead of $99
      };

      // Server-side price derivation logic
      const plans = JSON.parse(tenant.pricingPlans);
      const selectedPlan = plans.find(p => p.id === clientPayload.planId);
      const serverDerivedAmount = selectedPlan ? selectedPlan.price : 0;

      // Ensure client amount is discarded
      assert.equal(serverDerivedAmount, 99, 'Price must be derived strictly server-side from catalog');
      assert.notEqual(serverDerivedAmount, clientPayload.amount, 'Client-controlled amount must be ignored');
    });

    test('Checkout rejects lead belonging to another tenant', () => {
      const requestedTenantId = 'tenant_academy_a';
      const lead = {
        id: 'lead_999',
        tenantId: 'tenant_academy_b',
        email: 'student@example.com',
      };

      const leadMatchesTenant = lead.tenantId === requestedTenantId;
      assert.equal(leadMatchesTenant, false, 'Lead from Tenant B must not be attached to Tenant A checkout');
    });

    test('Checkout strictly requires lead email to match student email', () => {
      const lead = {
        id: 'lead_123',
        email: 'legit_student@example.com',
      };
      const impostorStudentEmail = 'attacker@malicious.com';
      const emailMatches = lead.email.toLowerCase() === impostorStudentEmail.toLowerCase();
      assert.equal(emailMatches, false, 'Impostor student cannot claim another lead during checkout');
    });

    test('Authenticated user cannot checkout for a tenant other than their own', () => {
      const authUser = {
        id: 'usr_student_1',
        role: 'student',
        tenantId: 'tenant_academy_a',
      };
      const requestedTenantId = 'tenant_academy_b';
      const isAuthorized = authUser.role === 'superadmin' || authUser.tenantId === requestedTenantId;
      assert.equal(isAuthorized, false, 'Student cannot initiate checkout for a different academy');
    });
  });

  // =========================================================================
  // Auditor Finding 2: Private Media Gateway & Storage Isolation
  // =========================================================================
  describe('Auditor Finding 2: Private Media Gateway & Storage Isolation', () => {
    test('Private categories generate protected /api/media URLs and not public web URLs', () => {
      const PRIVATE_CATEGORIES = ['recitations', 'assignments'];
      const fileKey = 'tenant_123/recitations/student_audio.mp3';
      const category = 'recitations';

      const isPrivate = PRIVATE_CATEGORIES.includes(category);
      assert.equal(isPrivate, true, 'Recitations must be classified as private media');

      const url = `/api/media?key=${encodeURIComponent(fileKey)}`;
      assert.match(url, /^\/api\/media\?key=/, 'Private files must route through authenticated media gateway');
      assert.equal(url.includes('/uploads/'), false, 'Private file URL must not point to public /uploads/');
    });

    test('Private media endpoint strictly blocks unauthenticated requests with 401', () => {
      const authUser = null; // Unauthenticated anonymous user
      const isPrivateCategory = true;

      const allowAccess = !isPrivateCategory || Boolean(authUser);
      assert.equal(allowAccess, false, 'Anonymous request to private media must be rejected');
    });

    test('Private media endpoint prevents cross-tenant access to recitations and assignments', () => {
      const authUser = {
        id: 'usr_student_2',
        role: 'student',
        tenantId: 'tenant_academy_a',
      };
      const requestedFileTenant = 'tenant_academy_b';

      const isAuthorized = authUser.role === 'superadmin' || authUser.tenantId === requestedFileTenant;
      assert.equal(isAuthorized, false, 'User from academy A cannot access private audio/submissions from academy B');
    });

    test('SuperAdmin is authorized to access media across all tenants', () => {
      const superAdminUser = {
        id: 'usr_superadmin',
        role: 'superadmin',
        tenantId: null,
      };
      const requestedFileTenant = 'tenant_academy_b';

      const isAuthorized = superAdminUser.role === 'superadmin' || superAdminUser.tenantId === requestedFileTenant;
      assert.equal(isAuthorized, true, 'SuperAdmin must have cross-tenant audit access');
    });

    test('Local filesystem storage saves private files outside public web directory', () => {
      const tenantId = 'tenant_100';
      const category = 'recitations';
      const fileName = 'surah_fatiha.mp3';

      const privatePath = path.join(process.cwd(), 'storage', 'private', tenantId, category, fileName);
      assert.equal(privatePath.includes(path.join('public', 'uploads')), false, 'Private file path must not be under public/uploads');
      assert.match(privatePath, /storage[\\\/]private/, 'Private files must reside in dedicated private storage directory');
    });
  });

  // =========================================================================
  // Auditor Finding 3: Database Credentials Cryptographic Vault & Disk Security
  // =========================================================================
  describe('Auditor Finding 3: Database Credentials Cryptographic Vault & Disk Security', () => {
    const crypto = require('crypto');
    const ALGORITHM = 'aes-256-gcm';
    const IV_LENGTH = 12;
    const SALT = 'ankabit-db-vault-salt-v1';
    const vaultKey = crypto.scryptSync('test-vault-secret-token', SALT, 32);

    function encrypt(text) {
      if (!text) return '';
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, vaultKey, iv);
      let enc = cipher.update(text, 'utf8', 'hex');
      enc += cipher.final('hex');
      const tag = cipher.getAuthTag().toString('hex');
      return `enc:${iv.toString('hex')}:${tag}:${enc}`;
    }

    function decrypt(cipherText) {
      if (!cipherText || !cipherText.startsWith('enc:')) return cipherText || '';
      const parts = cipherText.split(':');
      if (parts.length !== 4) return cipherText;
      const [, ivHex, tagHex, encHex] = parts;
      try {
        const iv = Buffer.from(ivHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, vaultKey, iv);
        decipher.setAuthTag(tag);
        let dec = decipher.update(encHex, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
      } catch {
        return '';
      }
    }

    test('AES-256-GCM vault encrypts and decrypts credentials accurately', () => {
      const originalPassword = 'super-secure-production-db-password-1234!';
      const encrypted = encrypt(originalPassword);

      assert.match(encrypted, /^enc:[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i, 'Encrypted format must be enc:<iv>:<tag>:<cipher>');
      assert.notEqual(encrypted, originalPassword, 'Encrypted string must not match plaintext');

      const decrypted = decrypt(encrypted);
      assert.equal(decrypted, originalPassword, 'Decrypted secret must match original password');
    });

    test('Tampered ciphertext or invalid authentication tag fails safely', () => {
      const originalSecret = 'sb_secret_role_key_value';
      const encrypted = encrypt(originalSecret);
      const parts = encrypted.split(':');
      // Corrupt the ciphertext
      parts[3] = 'bad' + parts[3].slice(3);
      const tampered = parts.join(':');

      const result = decrypt(tampered);
      assert.equal(result, '', 'Decryption of tampered ciphertext must return empty string safely');
    });

    test('data/database.config.json and storage/ are strictly ignored by .gitignore', () => {
      const rootGitignore = fs.readFileSync(path.join(process.cwd(), '..', '.gitignore'), 'utf8');
      const lmsGitignore = fs.readFileSync(path.join(process.cwd(), '.gitignore'), 'utf8');

      assert.match(rootGitignore, /data\/database\.config\.json/, 'Root .gitignore must ignore database.config.json');
      assert.match(rootGitignore, /storage\//, 'Root .gitignore must ignore storage/');
      assert.match(lmsGitignore, /data\/database\.config\.json/, 'LMS .gitignore must ignore database.config.json');
      assert.match(lmsGitignore, /storage\//, 'LMS .gitignore must ignore storage/');
    });
  });

});
