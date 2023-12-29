-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserPermissions" ADD VALUE 'permissions.signout';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.password-change';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.refresh-token';

-- AlterTable
ALTER TABLE "flights" ALTER COLUMN "start_flight_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "end_flight_date" SET DATA TYPE TIMESTAMPTZ;
