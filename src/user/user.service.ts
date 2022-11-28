import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { deleteUser } from 'supertokens-node';
import prisma from '../client';
import { EditRoleDto } from './dto/edit.role.dto';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateChatDto } from 'src/chat/dto/create.chat.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto) {
    await prisma.user.create({ data: createUserDto });
    const createChatDto = new CreateChatDto("Чат с тех-подержкй", "Можете задавать сдесь любые вопросы, наш специалист с вами свяжется.");
    const chat = await prisma.chat.create({
      data: createChatDto,
    });
    await prisma.chatToUser.create({
      data: { user_id: createUserDto.id, chat_id: chat.id },
    });
    const support = await prisma.user.findFirst({
      where:{is_support: true}
    })
    await prisma.chatToUser.create({
      data: { user_id: support.id, chat_id: chat.id },
    });
  }

  async updateRole(userId: string, editRoleDto: EditRoleDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if(user == null){
      throw new NotFoundException("User not found");
    }
    await prisma.user.update({
      where: { id: userId },
      data: editRoleDto,
    });
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if(user == null){
      throw new NotFoundException("User not found");
    }
    await prisma.user.delete({ where: { id: userId } });
  }

  async getLogin() {
    return { title: 'Авторизация - Ydea' };
  }

  async getRegister() {
    return { title: 'Регистрация - Ydea' };
  }
}
