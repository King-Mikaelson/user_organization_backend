/*
  Warnings:

  - The primary key for the `Organisation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Organisation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserOrganisations" DROP CONSTRAINT "UserOrganisations_organisationId_fkey";

-- DropIndex
DROP INDEX "Organisation_orgId_key";

-- AlterTable
ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Organisation_pkey" PRIMARY KEY ("orgId");

-- AddForeignKey
ALTER TABLE "UserOrganisations" ADD CONSTRAINT "UserOrganisations_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
