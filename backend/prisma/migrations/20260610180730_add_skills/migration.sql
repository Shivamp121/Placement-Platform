/*
  Warnings:

  - You are about to drop the column `skill` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "skill",
ADD COLUMN     "skills" TEXT[];
