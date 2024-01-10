import { Test, TestingModule } from '@nestjs/testing';
import { jest, expect } from '@jest/globals';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './domain/user.dto';
import { any, string } from 'joi';
import { JwtAuthGuard } from '@/src/libs/security/guards/security.guard';
import { FlightStatus, TicketStatus } from '@prisma/client';
describe('AuthController', () => {
  let controller: UserController;
  let service: UserService

  const mockPermissionGuard = {
  }

  const user: UserDto = {
    id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
    first_name: "asd",
    last_name: "asd",
    email: "admi123n@admin.com",
    tickets: []
  }
  const mockUserService = {
    getAllUsers: jest.fn(() => {
      return [{
        id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
        first_name: "asd",
        last_name: "asd",
        email: "admi123n@admin.com",
        tickets: []
      },]
    }),

    getOneUserById: jest.fn(() => {
      return {
        id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
        first_name: "asd",
        last_name: "asd",
        email: "admi123n@admin.com",
        tickets: []
      }
    }),

    getUsersBySearchQuery: jest.fn(() => {
      return [{
        id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
        first_name: "asd",
        last_name: "asd",
        email: "admi123n@admin.com",
        tickets: []
      }]
    }),

    deleteOrder: jest.fn(() => {
      return null
    }),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).overrideProvider(UserService).useValue(mockUserService)
      .overrideGuard(JwtAuthGuard).useValue(mockPermissionGuard)
      .compile();

    service = module.get<UserService>(UserService);
    controller = module.get<UserController>(UserController);
  });
  describe('getAllUsers', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
    it('should return an array of users', async () => {
      expect(await controller.getAllUsers(1)).toEqual([{
        id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
        first_name: "asd",
        last_name: "asd",
        email: "admi123n@admin.com",
        tickets: []
      },]);
    });

    it('should return an user', async () => {
      expect(await controller.getOneUserById('7bfe13fd-2d0c-467c-82a4-c31fb34d6452')).toEqual({
        id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
        first_name: "asd",
        last_name: "asd",
        email: "admi123n@admin.com",
        tickets: []
      });
    })
      it('should return an user by search query', async () => {
        expect(await controller.getUsersBySearchQuery('asd')).toEqual([{
          id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
          first_name: "asd",
          last_name: "asd",
          email: "admi123n@admin.com",
          tickets: []
        }]);
      });

      it('should return an user by search query', async () => {
        expect(await controller.getUsersBySearchQuery('asd')).toEqual([{
          id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
          first_name: "asd",
          last_name: "asd",
          email: "admi123n@admin.com",
          tickets: []
        }]);
      });
    });
  })
