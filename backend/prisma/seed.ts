import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start database seeding...');

  const filePath = path.join(__dirname, '../jobs.json'); 
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot find jobs.json at path: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const jobs = JSON.parse(rawData);

  const result = await prisma.job.createMany({
    data: jobs,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} jobs into the database!`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });