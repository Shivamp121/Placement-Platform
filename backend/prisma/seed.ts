import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const filePath = path.join(dirname, '../jobs.json')
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot find jobs.json at path: ${filePath}`)
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')
  const jobsData = JSON.parse(rawData)

  let company = await prisma.company.findFirst()

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'TechNova Solutions',
        description: 'Default hiring company for seed data',
        industry: 'Software and Technology',
        website: 'https://technova.example.com',
      },
    })
  }

  let recruiter = await prisma.recruiterProfile.findFirst()

  if (!recruiter) {
    const recruiterUser = await prisma.user.create({
      data: {
        email: 'recruiter@technova.example.com',
        password: 'hashedpassword123',
        name: 'Hiring Manager',
        role: 'RECRUITER',
      },
    })

    recruiter = await prisma.recruiterProfile.create({
      data: {
        userId: recruiterUser.id,
        companyId: company.id,
      },
    })
  }

  const jobsToInsert = jobsData.map((job: any) => {
    const { company: companyName, ...jobDetails } = job

    return {
      ...jobDetails,
      companyId: company.id,
      recruiterId: recruiter.id,
    }
  })

  await prisma.job.createMany({
    data: jobsToInsert,
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })