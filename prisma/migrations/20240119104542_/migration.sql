/*
  Warnings:

  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "messages_room_id_idx";

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
