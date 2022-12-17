import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import prisma from '../client';
import { EditRoleDto } from './dto/edit.role.dto';
import { CreateChatDto } from 'src/chat/dto/create.chat.dto';
import { EditUserDto } from './dto/edit.user.dto';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto) {
    await prisma.user.create({ data: createUserDto });
    const createChatDto = new CreateChatDto(
      'Чат с тех-подержкй',
      'Можете задавать сдесь любые вопросы, наш специалист с вами свяжется.',
    );
    const chat = await prisma.chat.create({
      data: createChatDto,
    });
    await prisma.chatToUser.create({
      data: { user_id: createUserDto.id, chat_id: chat.id },
    });
    const support = await prisma.user.findFirst({
      where: { is_support: true },
    });
    await prisma.chatToUser.create({
      data: { user_id: support.id, chat_id: chat.id },
    });
  }

  async updateRole(userId: string, editRoleDto: EditRoleDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    await prisma.user.update({
      where: { id: userId },
      data: editRoleDto,
    });
  }

  async editUser(userId: string, editUserDto: EditUserDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    await prisma.user.update({
      where: { id: userId },
      data: editUserDto,
    });
  }

  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    await prisma.user.delete({ where: { id: userId } });
  }

  async getLogin() {
    return { title: 'Авторизация - Ydea' };
  }

  async getRegister() {
    return { title: 'Регистрация - Ydea' };
  }

  async getSettings(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    let role = 'Покупатель';
    let is_admin = false;
    if (user.is_seller) {
      role = 'Продавец';
    }
    if (user.is_support) {
      role = 'Техподдержка';
    }
    if (user.is_moderator) {
      role = 'Модератор';
    }
    if (user.is_admin) {
      role = 'Администратор';
      is_admin = true;
    }

    const categories = await prisma.product_category.findMany({});

    let seller = false;
    if (user.is_seller) {
      seller = true;
    }
    if (seller) {
      const seller = await prisma.seller.findMany({
        where: { user_id: user.id },
      });
      return {
        user: user,
        is_seller: seller,
        seller: seller[0],
        role: role,
        categories: categories,
        is_admin: is_admin,
      };
    } else {
      return {
        user: user,
        is_seller: seller,
        role: role,
        categories: categories,
        is_admin: is_admin,
      };
    }
  }

  async getCategoryEditor() {
    const categories = await prisma.product_category.findMany({});
    return {
      categories: categories,
    };
  }
}
