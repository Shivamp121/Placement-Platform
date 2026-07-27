import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');
  const filePath = path.join(__dirname, '../jobs.json'); 
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot find jobs.json at path: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const jobsData = JSON.parse(rawData);

  let company = await prisma.company.findFirst();

  if (!company) {
    console.log('No existing company found. Creating a default Company...');
    company = await prisma.company.create({
      data: {
        name: 'TechNova Solutions',
        description: 'Default hiring company for seed data',
        location: 'Remote',
      },
    });
    console.log(`Default Company created with ID: ${company.id}`);
  } else {
    console.log(`Using existing Company ID: ${company.id}`);
  }
  const jobsToInsert = jobsData.map((job: any) => {
    const { company: _companyName, ...jobDetails } = job;

    return {
      ...jobDetails,
      companyId: company.id, 
    };
  });
  const result = await prisma.job.createMany({
    data: jobsToInsert,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} jobs into the database! 🎉`);
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