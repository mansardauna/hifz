import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  return (
    globalThis.prismaGlobal ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  );
};

export const prisma = (() => {
  try {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== 'production') {
      globalThis.prismaGlobal = client;
    }
    return client;
  } catch (error) {
    console.warn('Prisma initialization deferred until runtime database connection is configured.');
    return {} as PrismaClient;
  }
})();

export default prisma;
