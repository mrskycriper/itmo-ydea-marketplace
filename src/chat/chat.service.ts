import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create.chat.dto';
import { EditChatDto } from './dto/edit.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import prisma from '../client';

@Injectable()
export class ChatService {
  async getSomeChats(userId: string, page: number): Promise<object> {
    if (page < 1) {
      throw new BadRequestException('Invalid page number');
    }
    const take = 5;
    const count = await this._getChatAmount(userId);
    let pageCount = Math.ceil(count / take);
    if (pageCount == 0) {
      pageCount = 1;
    }
    if (page > pageCount) {
      throw new BadRequestException('Invalid page number');
    }
    const chats = await this._getChats(userId, page, take);
    let empty = true;
    if (Object.keys(chats).length != 0) {
      empty = false;
    }
    return {
      title: 'Чаты - OpenForum',
      chatData: chats,
      pageCount: pageCount,
      page: page,
      empty: empty,
    };
  }

  async _getChats(userId: string, page: number, take: number): Promise<object> {
    return await prisma.chat.findMany({
      where: {
        chat_to_user: {
          some: {
            user_id: userId,
          },
        },
      },
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async _getChatAmount(userId: string): Promise<number> {
    const chats = await prisma.chat.findMany({
      where: {
        chat_to_user: {
          some: {
            user_id: userId,
          },
        },
      },
    });
    return chats.length;
  }

  async getChat(chatId: number): Promise<object> {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (chat == null) {
      throw new NotFoundException('Chat not found');
    }
    const messages = await prisma.message.findMany({
      where: { chat_id: chat.id },
      orderBy: {
        created_at: 'asc',
      },
      include: { author: true },
    });
    return {
      title: chat.name + ' - OpenForum',
      chatName: chat.name,
      chatId: chatId,
      messages: messages,
    };
  }

  async inviteUser(chatId: number, inviteName: string) {
    const user = await prisma.user.findUnique({ where: { name: inviteName } });
    await prisma.chatToUser.create({
      data: { user_id: user.id, chat_id: chatId },
    });
  }

  async removeUser(chatId: number, unInviteName: string) {
    const user = await prisma.user.findUnique({
      where: { name: unInviteName },
    });
    await prisma.chatToUser.delete({
      where: {
        chat_id_user_id: {
          chat_id: chatId,
          user_id: user.id,
        },
      },
    });
  }

  async createChat(
    userId: string,
    createChatDto: CreateChatDto,
  ): Promise<object> {
    const chat = await prisma.chat.create({
      data: createChatDto,
    });
    await prisma.chatToUser.create({
      data: { user_id: userId, chat_id: chat.id },
    });
    return { chatId: chat.id };
  }

  async deleteChat(chatId: number) {
    await prisma.chat.delete({ where: { id: chatId } });
  }

  async editChat(chatId: number, editChatDto: EditChatDto) {
    await prisma.chat.update({ where: { id: chatId }, data: editChatDto });
  }

  async postMessage(
    userId: string,
    chatId: number,
    createMessageDto: CreateMessageDto,
  ) {
    await prisma.message.create({
      data: {
        created_at: new Date(),
        content: createMessageDto.content,
        user_id: userId,
        chat_id: chatId,
      },
    });
  }

  async getSettings(chatId: number): Promise<object> {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    const users = await prisma.user.findMany({
      where: {
        chat_to_user: {
          some: {
            chat_id: chatId,
          },
        },
      },
    });
    return {
      title: chat.name + ' - OpenForum',
      chatName: chat.name,
      chatId: chat.id,
      chatDescription: chat.description,
      users: users,
    };
  }
}
