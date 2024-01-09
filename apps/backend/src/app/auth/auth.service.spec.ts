import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { beforeEach, describe } from 'node:test';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
});