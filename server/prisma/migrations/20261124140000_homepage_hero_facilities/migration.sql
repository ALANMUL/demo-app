-- AlterTable
ALTER TABLE "AdmissionInfo" ADD COLUMN     "openYear" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SchoolAbout" ADD COLUMN     "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "heroLine" TEXT NOT NULL DEFAULT '';

