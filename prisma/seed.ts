import { PrismaClient, UserPermissions, UserRoles } from "@prisma/client";
import { mockCityData } from "./mock-city-data";
import { mockPlaneData } from "./mock-plane-data";

const prisma = new PrismaClient();
async function main() {
  const Client = await prisma.role.create({
    data: {
      type: UserRoles.Client,
      permissions: [UserPermissions.All],
    },
  });

  const Manager = await prisma.role.create({
    data: {
      type: UserRoles.Manager,
      permissions: [UserPermissions.All],
    },
  });

  const Admin = await prisma.role.create({
    data: {
      type: UserRoles.Admin,
      permissions: [UserPermissions.All],
    },
  });

  mockCityData.map(async (city) => {
    await prisma.city.create({
      data: { ...city },
    });
  });

  mockPlaneData.map(async (plane) => {
    await prisma.plane.create({
      data: { ...plane },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
