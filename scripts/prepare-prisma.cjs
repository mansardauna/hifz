const fs = require('fs');
const path = require('path');

// Auto-detect and configure Prisma datasource for MySQL, PostgreSQL, or Supabase
function preparePrisma() {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.warn('[prepare-prisma] schema.prisma not found at:', schemaPath);
    return;
  }

  let content = fs.readFileSync(schemaPath, 'utf8');

  // Detect active engine
  let engine = 'mysql';

  // 1. Check data/database.config.json
  const configPath = path.join(process.cwd(), 'data', 'database.config.json');
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg.engine === 'postgres' || cfg.engine === 'supabase') {
        engine = 'postgresql';
      } else if (cfg.engine === 'mysql') {
        engine = 'mysql';
      }
    } catch (_e) {}
  }

  // 2. Check explicit DATABASE_ENGINE environment variable
  const engineVar = (process.env.DATABASE_ENGINE || '').toLowerCase().trim();
  if (engineVar === 'supabase' || engineVar === 'postgres' || engineVar === 'postgresql') {
    engine = 'postgresql';
  } else if (engineVar === 'mysql') {
    engine = 'mysql';
  } else {
    // 3. Check connection string environment variables
    const dbUrl = process.env.DATABASE_URL || '';
    const pgUrl = process.env.POSTGRES_DATABASE_URL || process.env.POSTGRES_URL || '';
    const isVercel = Boolean(process.env.VERCEL);

    if (isVercel || pgUrl) {
      if (pgUrl || dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
        engine = 'postgresql';
      }
    } else if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
      engine = 'postgresql';
    }
  }

  console.log(`[prepare-prisma] Target database engine: ${engine.toUpperCase()}`);

  if (engine === 'postgresql') {
    // Replace datasource block with postgresql + directUrl
    content = content.replace(
      /datasource\s+db\s*\{[\s\S]*?\}/,
      `datasource db {\n  provider  = "postgresql"\n  url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")\n}`
    );
  } else {
    // Replace datasource block with mysql
    content = content.replace(
      /datasource\s+db\s*\{[\s\S]*?\}/,
      `datasource db {\n  provider = "mysql"\n  url      = env("DATABASE_URL")\n}`
    );
  }

  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log(`[prepare-prisma] Updated prisma/schema.prisma datasource to provider="${engine}".`);
}

preparePrisma();
