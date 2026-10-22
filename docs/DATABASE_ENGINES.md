# Multi-Database Engine Guide: MySQL, PostgreSQL & Supabase

Ankabit LMS is engineered with a polymorphic multi-database architecture supporting:
1. **MySQL / MariaDB 10.11+** (Default for local XAMPP and high-throughput MariaDB clusters)
2. **PostgreSQL 14+** (Self-hosted or managed PostgreSQL, AWS RDS, Neon)
3. **Supabase Cloud** (Managed PostgreSQL with Transaction Pooler & Direct URL)

---

## How Dynamic Prisma Multi-Database Works

Prisma ORM requires the `datasource db { provider = "..." }` in `prisma/schema.prisma` to match the target database dialect (`mysql` vs `postgresql`).

To eliminate manual schema editing and prevent engine mismatch errors:
1. The pre-build script `scripts/prepare-prisma.cjs` runs automatically prior to `prisma generate` during:
   * `npm run build`
   * `npm run dev`
   * `npm run postinstall`
2. It detects the target engine using the following priority order:
   * **Active config file**: `data/database.config.json` (`engine: "mysql"` | `"postgres"` | `"supabase"`)
   * **Explicit environment variable**: `DATABASE_ENGINE="supabase"` | `"postgres"` | `"mysql"`
   * **Connection strings**:
     * If `POSTGRES_DATABASE_URL` is set, or `DATABASE_URL` starts with `postgres://` or `postgresql://` $\rightarrow$ automatically switches Prisma datasource to `provider = "postgresql"` with `directUrl = env("DIRECT_URL")`.
     * If `DATABASE_URL` starts with `mysql://` $\rightarrow$ automatically switches Prisma datasource to `provider = "mysql"`.
3. In `src/lib/prisma.ts`, `resolveActiveDatabaseUrl()` dynamically configures connection strings, pool sizes, and credentials at runtime.

---

## Supabase Cloud Deployment Configuration (Vercel)

When deploying to Vercel with Supabase:
1. Set the following environment variables in Vercel Project Settings:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   DATABASE_ENGINE="supabase"
   ```
2. For an initial non-production schema setup, run:
   ```bash
    npx prisma db push
   ```

---

## Local MySQL (XAMPP) Deployment Configuration

When running locally with XAMPP MySQL:
1. Set in `.env`:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/ankabit_lms"
   DATABASE_ENGINE="mysql"
   ```
2. Run database schema sync for local development:
   ```bash
   node scripts/prepare-prisma.cjs
   npx prisma db push
   ```
