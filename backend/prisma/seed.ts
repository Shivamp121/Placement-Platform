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

  let recruiterUser = await prisma.user.findFirst({
    where: { role: 'RECRUITER' },
  })

  if (!recruiterUser) {
    recruiterUser = await prisma.user.create({
      data: {
        email: 'recruiter@technova.example.com',
        password: 'hashedpassword123',
        role: 'RECRUITER',
        recruiterProfile: {
          create: {
            designation: 'Senior Hiring Manager',
            companies: {
              connect: { id: company.id },
            },
          },
        },
      },
    })
  }

  const jobsToInsert = jobsData.map((job: any) => {
    const { company: companyName, salary, type, requirements, ...jobDetails } = job

    return {
      ...jobDetails,
      salaryRange: salary || job.salaryRange || 'Not specified',
      jobType: type === 'Internship' ? 'INTERNSHIP' : 'FULL_TIME',
      requirements: requirements || [],
      companyId: company.id,
      recruiterId: recruiterUser.id,
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