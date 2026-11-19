-- AlterTable
ALTER TABLE "SchoolAbout" ADD COLUMN     "principalMessage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "principalName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "principalPhoto" TEXT,
ADD COLUMN     "principalTitle" TEXT NOT NULL DEFAULT '';
