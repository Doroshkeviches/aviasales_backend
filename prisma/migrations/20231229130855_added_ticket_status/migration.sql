/*
  Warnings:

  - The values [fullfield] on the enum `FlightStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `holdet_first_name` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `holder_first_name` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('fulfilled', 'canceled');

-- AlterEnum
BEGIN;
CREATE TYPE "FlightStatus_new" AS ENUM ('planned', 'flying', 'fulfilled', 'canceled');
ALTER TABLE "flights" ALTER COLUMN "status" TYPE "FlightStatus_new" USING ("status"::text::"FlightStatus_new");
ALTER TYPE "FlightStatus" RENAME TO "FlightStatus_old";
ALTER TYPE "FlightStatus_new" RENAME TO "FlightStatus";
DROP TYPE "FlightStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "holdet_first_name",
ADD COLUMN     "holder_first_name" TEXT NOT NULL,
ADD COLUMN     "status" "TicketStatus" NOT NULL;
