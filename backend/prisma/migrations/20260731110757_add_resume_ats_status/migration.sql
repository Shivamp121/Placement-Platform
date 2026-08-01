-- CreateEnum
CREATE TYPE "AtsStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "aiFeedback" TEXT,
ADD COLUMN     "atsScore" DOUBLE PRECISION,
ADD COLUMN     "atsStatus" "AtsStatus" NOT NULL DEFAULT 'PENDING';
