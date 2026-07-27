import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const filePath = path.join(__dirname, '../jobs.json');
  
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
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });