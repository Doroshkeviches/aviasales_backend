import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatGetawayService {
  getHello(): string {
    return 'Hello World!';
  }
}
