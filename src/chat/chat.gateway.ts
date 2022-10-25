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
    if (message.userId == null) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await prisma.user.findUnique({
      where: { id: message.userId },
    });
    await this.chatsService.postMessage(user.id, message.chatId, {
      content: message.content,
    });
    this.server.emit('messageFromServer', {
      content: message.content,
      createdAt: new Date(),
      author: user,
      chatId: message.chatId,
    });
  }
}
