import { Test, TestingModule } from '@nestjs/testing';
import { ChatGetawayController } from './chat-getaway.controller';
import { ChatGetawayService } from './chat-getaway.service';

describe('ChatGetawayController', () => {
  let chatGetawayController: ChatGetawayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatGetawayController],
      providers: [ChatGetawayService],
    }).compile();

    chatGetawayController = app.get<ChatGetawayController>(ChatGetawayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatGetawayController.getHello()).toBe('Hello World!');
    });
  });
});
