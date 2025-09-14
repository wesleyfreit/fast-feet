import { DomainEvents } from '@/core/events/domain-events';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import { PrismaClient } from 'generated/prisma/client';

config({ path: '.env.test', override: true });

const prisma = new PrismaClient();

const schema = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schema);

  process.env.DATABASE_URL = databaseURL;

  execSync('pnpm prisma db push');

  DomainEvents.shouldRun = false;
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await prisma.$disconnect();
});
