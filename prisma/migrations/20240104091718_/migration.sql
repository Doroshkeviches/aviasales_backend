/*
  Warnings:

  - The values [permissions.chat] on the enum `UserPermissions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserPermissions_new" AS ENUM ('permissions.all', 'permissions.signout', 'permissions.password-change', 'permissions.refresh-token', 'permissions.get-all-cities', 'permissions.get-city-by-id', 'permissions.create-new-city', 'permissions.update-city-title-by-id', 'permissions.delete-city-by-id', 'permissions.get-array-of-path', 'permissions.change-flight-status', 'permissions.change-flight-price', 'permissions.create-order', 'permissions.update-order-status', 'permissions.delete-order-by-id', 'permissions.get-orders-by-user-id', 'permissions.get-ticket-by-id', 'permissions.get-ticket-by-order-id', 'permissions.get-ticket-by-flight-id', 'permissions.delete-ticket-by-id', 'permissions.access-chat', 'permissions.start-chat');
ALTER TABLE "roles" ALTER COLUMN "permissions" TYPE "UserPermissions_new"[] USING ("permissions"::text::"UserPermissions_new"[]);
ALTER TYPE "UserPermissions" RENAME TO "UserPermissions_old";
ALTER TYPE "UserPermissions_new" RENAME TO "UserPermissions";
DROP TYPE "UserPermissions_old";
COMMIT;
