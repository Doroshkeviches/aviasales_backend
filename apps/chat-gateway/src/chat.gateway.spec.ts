import { ExecutionContext, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ChatGateway } from "./chat.gateway";
import { Socket, io } from "socket.io-client";
import { AuthController } from "@/src/app/auth/auth.controller";
import { AuthService } from "@/src/app/auth/auth.service";
import { I18nContext, I18nService } from "nestjs-i18n";
import { jest } from "@jest/globals";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { RedisService } from "./redis/redis.service";
import { RedisRepository } from "./domain/repos/redis-repos.service";
import { JwtAuthGuard } from "../../../libs/security/guards/security.guard";
import { RedisModule } from "./redis/redis.module";
import { v4 } from "uuid";
import { RequestDto } from "./domain/request.dto";
import { Server } from "socket.io";
import { SecurityService } from "@app/security";
import { UserSessionDto } from "@app/security/dtos/UserSessionDto";
import {User, UserRoles} from "@prisma/client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { user_id } from "@/src/types/user-id.type";

const mockRoomId = v4();
const mockMessage = "Hello";
const mockRequestDto: RequestDto = {
  id: "e1239ef2-2341-418e-af75-393f3a9a7cc2",
  first_name: "John",
  last_name: "Smith",
};
const mockServer: Server = new Server();
const mockUser = {
  id: "7bfe13fd-2d0c-467c-82a4-c31fb34d6452",
  first_name: "asd",
  last_name: "asd",
  role_id: "61a9c74c-eda3-4f4d-8037-e35ad4d2e7c9",
  role_type: UserRoles.Client,
  email: "admi123n@admin.com",
  password: "$2a$05$5htSIabJmdX86Rj5lqto8e3/w0HJAowRcnpTGovPkkqm1R5a4SJ6i",
  tickets: [],
};

async function eventReception(from: Socket, event: string): Promise<void> {
  return new Promise<void>((resolve) => {
    from.on(event, () => {
      resolve();
    });
  });
}

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe("ChatGateway", () => {
  // let gateway: ChatGateway;
  // let app: INestApplication;
  // let ioClient: Socket;

  let gateway: ChatGateway;
  let redisService: RedisService;
  let redisServiceSpy;
  let securityService: SecurityService;

  let managerClient: Socket;
  let customerClient: Socket;

  let redisManagerClient;

  let app: INestApplication;

  const mockPermissionGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      console.log("in mocked guard");
      const client = context.switchToWs().getClient();
      client.data.user = mockUser;
      console.log(client.data);
      return true;
    }),
  };
  const mockSecurityService = {
    getUserById: jest.fn(({ id }: user_id) => {
      console.log("id", id);
      console.log("mock user id", mockUser.id);
      if (id === mockUser.id) {
        return mockUser;
      }
      return null;
    }),
  };

  const mockRedisService = {
      onRequest: jest.fn(() => {

      }),
      subToMessage: jest.fn((user: Pick<User, 'id' | 'first_name' | 'last_name'>) => {

      }),

  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        {
          provide: I18nService,
          useValue: { t: jest.fn(() => "some value") },
        },
        RedisService,
        SecurityService,
        ChatGateway,
      ],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({ secretOrPrivateKey: "SECRET" }),
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockPermissionGuard)
      .overrideProvider(SecurityService)
      .useValue(mockSecurityService)
      .overrideProvider(RedisService)
      .useValue(mockRedisService)
      .compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    redisService = module.get<RedisService>(RedisService);
    securityService = module.get<SecurityService>(SecurityService);

    app = module.createNestApplication();

    // redisServiceSpy = {
    //     onRequest: jest.spyOn(redisService, 'onRequest'),
    //     onSendMessage: jest.spyOn(redisService, 'onSendMessage'),
    //     subToMessage: jest.spyOn(redisService, 'subToMessage'),
    //     subToRequestChannel: jest.spyOn(redisService, 'subToRequestChannel'),
    //     onDisconnect: jest.spyOn(redisService, 'onDisconnect')
    // }

    // Instantiate the app
    // app = await createNestApp(ChatGateway);
    // // Get the gateway instance from the app instance
    // gateway = app.get<ChatGateway>(ChatGateway);
    // // Create a new client that will interact with the gateway
    managerClient = io("http://localhost:6000", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
    customerClient = io("http://localhost:6000", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    // app = module.createNestApplication();
    //
    await app.listen(6000);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  it("customer should join a room and send a request", async () => {
    customerClient.connect();
    // console.log(customerClient);

    customerClient.emit("join-chat", mockRoomId);
    await new Promise<void>((resolve) => {
      customerClient.on("connect", () => {
        console.log("connected");
      });

      customerClient.on("join-chat", (data) => {
        expect(data).toEqual(mockRoomId);
        console.log("joined chat");
        resolve();
      });
    });

    customerClient.disconnect();
    // customerClient.on("join-chat", (data) => {
    //     expect(data).toEqual(mockRoomId);
    // })
    //

    //
    // await eventReception(customerClient, "join-chat");

    // const userDto = UserSessionDto.fromPayload(mockUser);
    // const user = mockSecurityService.getUserById(userDto.id);
    // expect(user).toEqual(mockUser);
    // const requestDto = RequestDto.toEntity(user);

    // короче забить на редис, просто проверить все методы с гейтвея, также в гейтвее обработать исключения
    // отдельно протестировать редис сервис
    expect(redisServiceSpy.onRequest).toBeCalledWith(mockRequestDto);
    expect(redisServiceSpy.subToMessage).toBeCalledWith(
      mockRoomId,
      mockServer,
      customerClient,
    );
    //
    // managerClient.on("message", (data) => {
    //     expect(data).toEqual(mockRequestDto);
    // });
    // customerClient.on("disconnect", () => done());
    // customerClient.close();
    // done();
  }, 30000);

  // it('should emit "pong" on "ping"', async () => {
  //     ioClient.connect();
  //     ioClient.emit("ping", "Hello world!");
  //     await new Promise<void>((resolve) => {
  //         ioClient.on("connect", () => {
  //             console.log("connected");
  //         });
  //         ioClient.on("pong", (data) => {
  //             expect(data).toBe("Hello world!");
  //             resolve();
  //         });
  //     });
  //     ioClient.disconnect();
  // });
});