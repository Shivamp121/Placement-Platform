import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); 

async function main() {
  console.log("Starting database seeding...");
  const existingJob = await prisma.job.findFirst();
  const existingStudent = await prisma.studentProfile.findFirst();
  if (!existingJob || !existingStudent) {
    console.error("Seeding halted: You must have at least one Job and one Student Profile created in your database before running this seed script.");
    return;
  }

  console.log(`Found Job ID: ${existingJob.id}`);
  console.log(`Found Student ID: ${existingStudent.id}`);

  const statuses = ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED"];
  
  console.log("Creating 10 dummy applications...");
  for (let i = 0; i < 10; i++) {
    const randomScore = Math.floor(Math.random() * (95 - 40 + 1) + 40); 
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    await prisma.application.upsert({
      where: {
        studentId_jobId: {
          studentId: existingStudent.id,
          jobId: existingJob.id
        }
      },
      update: {
        atsScore: randomScore,
        status: randomStatus as any
      },
      create: {
        jobId: existingJob.id,
        studentId: existingStudent.id,
        atsScore: randomScore,
        status: randomStatus as any
      }
    });
  }

  console.log("Seeding finished! 10 dummy applications created or updated successfully. 🎉");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });