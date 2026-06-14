/*
  Warnings:

  - You are about to drop the column `companyId` on the `RecruiterProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecruiterProfile" DROP CONSTRAINT "RecruiterProfile_companyId_fkey";

-- AlterTable
ALTER TABLE "RecruiterProfile" DROP COLUMN "companyId";

-- CreateTable
CREATE TABLE "_CompanyToRecruiterProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToRecruiterProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToRecruiterProfile_B_index" ON "_CompanyToRecruiterProfile"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToRecruiterProfile" ADD CONSTRAINT "_CompanyToRecruiterProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToRecruiterProfile" ADD CONSTRAINT "_CompanyToRecruiterProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "RecruiterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
