/*
  Warnings:

  - The primary key for the `CodingChallenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CodingChallenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Contest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Contest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Submission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `contestId` on the `CodingChallenge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `challengeId` on the `Submission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CodingChallenge" DROP CONSTRAINT "CodingChallenge_contestId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_challengeId_fkey";

-- AlterTable
ALTER TABLE "CodingChallenge" DROP CONSTRAINT "CodingChallenge_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "contestId",
ADD COLUMN     "contestId" UUID NOT NULL,
ADD CONSTRAINT "CodingChallenge_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Contest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "challengeId",
ADD COLUMN     "challengeId" UUID NOT NULL,
ADD CONSTRAINT "Submission_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodingChallenge" ADD CONSTRAINT "CodingChallenge_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "CodingChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
