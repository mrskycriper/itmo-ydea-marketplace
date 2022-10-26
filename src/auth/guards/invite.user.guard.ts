import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import prisma from '../../client';

@Injectable()
export class InviteUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    let session: SessionContainer;
    try {
      session = await Session.getSession(
        httpContext.getRequest(),
        httpContext.getResponse(),
      );
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
    const path = httpContext.getRequest().path;
    let chatId: number;
    try {
      chatId = Number.parseInt(path.split('/')[2]);
    } catch (err) {
      throw new BadRequestException('Invalid chat id');
    }
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (chat == null) {
      throw new NotFoundException('Chat not found');
    }

    const userName = path.split('/')[4];
    const user = await prisma.user.findUnique({
      where: { name: userName },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }

    const userId = session.getUserId();
    const chatToUser = await prisma.chatToUser.findUnique({
      where: { chat_id_user_id: { chat_id: chatId, user_id: userId } },
    });
    if (chatToUser == null) {
      throw new ForbiddenException('Access forbidden');
    }

    return true;
  }
}
