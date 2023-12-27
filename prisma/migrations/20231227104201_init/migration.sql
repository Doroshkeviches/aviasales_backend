-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('admin', 'client', 'manager');

-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('planned', 'flying', 'fullfield', 'canceled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('in process', 'rejected', 'accepted');

-- CreateEnum
CREATE TYPE "UserPermissions" AS ENUM ('permissions.all');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role_id" UUID NOT NULL,
    "role_type" "UserRoles" NOT NULL,
    "email" TEXT NOT NULL,
    "refresh_token" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "holdet_first_name" TEXT NOT NULL,
    "holder_last_name" TEXT NOT NULL,
    "order_id" UUID,
    "flight_id" UUID NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" UUID NOT NULL,
    "from_city_id" UUID NOT NULL,
    "to_city_id" UUID NOT NULL,
    "start_flight_date" TIMESTAMP(3) NOT NULL,
    "end_flight_date" TIMESTAMP(3) NOT NULL,
    "status" "FlightStatus" NOT NULL,
    "price" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "plane_id" UUID NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "type" "UserRoles" NOT NULL,
    "permissions" "UserPermissions"[],

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "orders_id_idx" ON "orders"("id");

-- CreateIndex
CREATE INDEX "tickets_id_idx" ON "tickets"("id");

-- CreateIndex
CREATE INDEX "flights_id_from_city_id_to_city_id_idx" ON "flights"("id", "from_city_id", "to_city_id");

-- CreateIndex
CREATE INDEX "planes_id_idx" ON "planes"("id");

-- CreateIndex
CREATE INDEX "cities_id_idx" ON "cities"("id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_id_type_key" ON "roles"("id", "type");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_role_type_fkey" FOREIGN KEY ("role_id", "role_type") REFERENCES "roles"("id", "type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_from_city_id_fkey" FOREIGN KEY ("from_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_to_city_id_fkey" FOREIGN KEY ("to_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
