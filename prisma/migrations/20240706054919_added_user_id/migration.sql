/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserOrganisations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserOrganisations` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `UserOrganisations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOrganisations" DROP CONSTRAINT "UserOrganisations_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "UserOrganisations" DROP CONSTRAINT "UserOrganisations_pkey",
DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD CONSTRAINT "UserOrganisations_pkey" PRIMARY KEY ("authorId", "organisationId");

-- AddForeignKey
ALTER TABLE "UserOrganisations" ADD CONSTRAINT "UserOrganisations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
