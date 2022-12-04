import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ReceiveMessageDto } from './dto/receive.message.dto';
import prisma from '../client';
import { UnauthorizedException } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server;

  constructor(private readonly chatsService: ChatService) {}

  @SubscribeMessage('messageFromClient')
  async handleEvent(@MessageBody() message: ReceiveMessageDto) {
    if (message.user_id == null) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await prisma.user.findUnique({
      where: { id: message.user_id },
    });
    await this.chatsService.postMessage(user.id, message.chat_id, {
      content: message.content,
    });
    this.server.emit('messageFromServer', {
      content: message.content,
      createdAt: new Date(),
      author: user,
      chat_id: message.chat_id,
    });
  }
}
