/*
  Warnings:

  - You are about to drop the column `order_id` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-all-cities';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-city-by-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.create-new-city';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.update-city-title-by-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.delete-city-by-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-array-of-path';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.change-flight-status';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.change-flight-price';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.create-order';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.update-order-status';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.delete-order-by-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-orders-by-user-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-ticket-by-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-ticket-by-order-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.get-ticket-by-flight-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.delete-ticket-by-id';
ALTER TYPE "UserPermissions" ADD VALUE 'permissions.chat';

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "order_id";

-- DropEnum
DROP TYPE "OrderStatus";
