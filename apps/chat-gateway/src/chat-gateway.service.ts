import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
