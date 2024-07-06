/*
  Warnings:

  - A unique constraint covering the columns `[orgId]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Organisation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organisation" ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_orgId_key" ON "Organisation"("orgId");
