import { PrismaClient, UserPermissions, UserRoles } from '@prisma/client';
import { mockCityData } from './mock-city-data';
import { mockPlaneData } from './mock-plane-data';
import { mock } from './mock-flight-data';

const prisma = new PrismaClient();

async function main() {
  const Client = await prisma.role.create({
    data: {
      type: UserRoles.Client,
      permissions: [
        UserPermissions.Signout,
        UserPermissions.PasswordChange,
        UserPermissions.RefreshToken,
        UserPermissions.GetUserById,
        UserPermissions.UpdateUser,
        UserPermissions.GetAllCities,
        UserPermissions.GetCityById,
        UserPermissions.CreateNewCity,
        UserPermissions.UpdateCityTitleById,
        UserPermissions.DeleteCityById,
        UserPermissions.GetArrayOfPath,
        UserPermissions.GetActiveTicketsByUserId,
        UserPermissions.DeleteTicketById,
        UserPermissions.CreateNewTicket,
        UserPermissions.UpdateTicketHolderCredentials,
        UserPermissions.GetTicketsInCartByUserId,
        UserPermissions.UpdateTicketStatusToOrdered,
        UserPermissions.SendMessages,
        UserPermissions.GetMessages,
        UserPermissions.PublishToRooms,
        UserPermissions.SignoutSelectSession,
        UserPermissions.SignoutSessions,
        UserPermissions.GetUserDevices,
      ],
    },
  });

  const Manager = await prisma.role.create({
    data: {
      type: UserRoles.Manager,
      permissions: [
        UserPermissions.GetAllUsers,
        UserPermissions.GetUserById,
        UserPermissions.GetUsersBySearchQuery,
        UserPermissions.UpdateUser,
        UserPermissions.GetAllUsers,
        UserPermissions.GetCityById,
        UserPermissions.CreateNewCity,
        UserPermissions.UpdateCityTitleById,
        UserPermissions.DeleteCityById,
        UserPermissions.GetArrayOfPath,
        UserPermissions.GetAllTickets,
        UserPermissions.GetActiveTicketsByUserId,
        UserPermissions.DeleteTicketById,
        UserPermissions.UpdateTicketStatus,
        UserPermissions.UpdateTicketHolderCredentials,
        UserPermissions.GetRooms,
        UserPermissions.GetMessages,
        UserPermissions.SendMessages,
        UserPermissions.JoinRoom,
        UserPermissions.SubscribeToRooms,
        UserPermissions.SignoutSelectSession,
        UserPermissions.SignoutSessions,
        UserPermissions.GetUserDevices,
      ],
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

  const cities = await prisma.city.findMany();
  const planes = await prisma.plane.findMany();
  setTimeout(() => {
    mock(cities, planes).then((mockFlightsData) =>
      mockFlightsData.map(async (flight) => {
        await prisma.flight.create({
          data: { ...flight },
        });
      })
    );
  }, 2000);

  const adminRole = await prisma.role.findFirst({
    where: {
      type: UserRoles.Admin,
    },
  });
  const clientRole = await prisma.role.findFirst({
    where: {
      type: UserRoles.Client,
    },
  });
  const managerRole = await prisma.role.findFirst({
    where: {
      type: UserRoles.Manager,
    },
  });

  const adminUser1 = await prisma.user.create({
    data: {
      email: 'admin1@admin.com',
      first_name: 'Ivan',
      last_name: 'Ivanov',
      role_type: adminRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: adminRole.id,
    },
  });

  const adminUser2 = await prisma.user.create({
    data: {
      email: 'admin2@admin.com',
      first_name: 'Kirill',
      last_name: 'Kirillov',
      role_type: adminRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: adminRole.id,
    },
  });

  const adminUser3 = await prisma.user.create({
    data: {
      email: 'admin3@admin.com',
      first_name: 'Maksim',
      last_name: 'Maksimov',
      role_type: adminRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: adminRole.id,
    },
  });

  const managerUser1 = await prisma.user.create({
    data: {
      email: 'manager1@manager.com',
      first_name: 'Egor',
      last_name: 'Egorov',
      role_type: managerRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: managerRole.id,
    },
  });

  const managerUser2 = await prisma.user.create({
    data: {
      email: 'manager2@manager.com',
      first_name: 'Anton',
      last_name: 'Antonov',
      role_type: managerRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: managerRole.id,
    },
  });

  const managerUser3 = await prisma.user.create({
    data: {
      email: 'manager3@manager.com',
      first_name: 'Mashulik',
      last_name: 'Velikolepnaya',
      role_type: managerRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: managerRole.id,
    },
  });

  const clientUser1 = await prisma.user.create({
    data: {
      email: 'user1@user.com',
      first_name: 'Filipp',
      last_name: 'Filippov',
      role_type: clientRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: clientRole.id,
    },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      email: 'user2@user.com',
      first_name: 'Stanislav',
      last_name: 'Durakov',
      role_type: clientRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: clientRole.id,
    },
  });

  const clientUser3 = await prisma.user.create({
    data: {
      email: 'user3@user.com',
      first_name: 'Varvara',
      last_name: 'Krasivaya',
      role_type: clientRole.type,
      password: 'AAAAaaaa1111!!!!',
      role_id: clientRole.id,
    },
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
