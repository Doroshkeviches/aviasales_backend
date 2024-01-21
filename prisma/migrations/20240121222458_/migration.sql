/*
  Warnings:

  - The values [permissions.access-chat,permissions.start-chat] on the enum `UserPermissions` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserPermissions_new" AS ENUM ('permissions.all', 'permissions.signout', 'permissions.password-change', 'permissions.refresh-token', 'permissions.get-all-users', 'permissions.get-user-by-id', 'permissions.get-users-by-search-query', 'permissions.update-user', 'permissions.get-all-cities', 'permissions.get-city-by-id', 'permissions.create-new-city', 'permissions.update-city-title-by-id', 'permissions.delete-city-by-id', 'permissions.get-array-of-path', 'permissions.change-flight-status', 'permissions.change-flight-price', 'permissions.get-all-tickets', 'permissions.get-ticket-by-id', 'permissions.delete-ticket-by-id', 'permissions.update-ticket-status', 'permissions.create-new-ticket', 'permissions.update-ticket-holder-credentials', 'permissions.get-rooms', 'permissions.get-messages', 'permissions.send-messages', 'permissions.join-room', 'permissions.publish-to-rooms', 'permissions.subscribe-to-rooms');
ALTER TABLE "roles" ALTER COLUMN "permissions" TYPE "UserPermissions_new"[] USING ("permissions"::text::"UserPermissions_new"[]);
ALTER TYPE "UserPermissions" RENAME TO "UserPermissions_old";
ALTER TYPE "UserPermissions_new" RENAME TO "UserPermissions";
DROP TYPE "UserPermissions_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_room_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user_id_fkey";

-- DropTable
DROP TABLE "messages";

-- DropTable
DROP TABLE "rooms";
