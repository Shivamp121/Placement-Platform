import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";

// 1. Create a traditional pg Pool using your environment URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Instantiate the Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to your Prisma Client (No 'datasource' property needed!)
const prisma = new PrismaClient({ adapter });

export default prisma;