/*
  Warnings:

  - You are about to drop the column `holdet_first_name` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `holder_first_name` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "holdet_first_name",
ADD COLUMN     "holder_first_name" TEXT NOT NULL;
