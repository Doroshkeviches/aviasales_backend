/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "refresh_token";

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "refresh_token" UUID,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_user_id_device_id_key" ON "devices"("user_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_refresh_token_key" ON "devices"("device_id", "refresh_token");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
