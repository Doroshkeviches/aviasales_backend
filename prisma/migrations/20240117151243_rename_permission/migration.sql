/*
  Warnings:

  - The values [permissions.get-tickets-by-user-id] on the enum `UserPermissions` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserPermissions_new" AS ENUM ('permissions.all', 'permissions.signout', 'permissions.password-change', 'permissions.refresh-token', 'permissions.get-all-users', 'permissions.get-user-by-id', 'permissions.get-users-by-search-query', 'permissions.update-user', 'permissions.get-all-cities', 'permissions.get-city-by-id', 'permissions.create-new-city', 'permissions.update-city-title-by-id', 'permissions.delete-city-by-id', 'permissions.get-array-of-path', 'permissions.change-flight-status', 'permissions.change-flight-price', 'permissions.get-all-tickets', 'permissions.get-ticket-by-id', 'permissions.get-active-tickets-by-user-id', 'permissions.delete-ticket-by-id', 'permissions.update-ticket-status', 'permissions.create-new-ticket', 'permissions.update-ticket-holder-credentials', 'permissions.access-chat', 'permissions.start-chat');
ALTER TABLE "roles" ALTER COLUMN "permissions" TYPE "UserPermissions_new"[] USING ("permissions"::text::"UserPermissions_new"[]);
ALTER TYPE "UserPermissions" RENAME TO "UserPermissions_old";
ALTER TYPE "UserPermissions_new" RENAME TO "UserPermissions";
DROP TYPE "UserPermissions_old";
COMMIT;
