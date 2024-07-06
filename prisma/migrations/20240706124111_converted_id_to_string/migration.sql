/*
  Warnings:

  - The primary key for the `Organisation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserOrganisations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UserOrganisations" DROP CONSTRAINT "UserOrganisations_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganisations" DROP CONSTRAINT "UserOrganisations_organisationId_fkey";

-- AlterTable
ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Organisation_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");
DROP SEQUENCE "User_userId_seq";

-- AlterTable
ALTER TABLE "UserOrganisations" DROP CONSTRAINT "UserOrganisations_pkey",
ALTER COLUMN "organisationId" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserOrganisations_pkey" PRIMARY KEY ("authorId", "organisationId");

-- AddForeignKey
ALTER TABLE "UserOrganisations" ADD CONSTRAINT "UserOrganisations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganisations" ADD CONSTRAINT "UserOrganisations_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
