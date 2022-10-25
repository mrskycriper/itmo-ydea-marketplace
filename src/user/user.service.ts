import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateBioDto } from './dto/update.bio.dto';
import { deleteUser } from 'supertokens-node';
import prisma from '../client';
import { EditRoleDto } from './dto/edit.role.dto';

@Injectable()
export class UserService {
  async isUsernameTaken(username: string): Promise<object> {
    const nameTaken = await prisma.user.findUnique({
      where: { name: username },
    });
    let isNameTaken = true;
    if (nameTaken == null) {
      isNameTaken = false;
    }
    return { isNameTaken: isNameTaken };
  }

  async createUser(createUserDto: CreateUserDto) {
    const nameTaken = await prisma.user.findUnique({
      where: { name: createUserDto.name },
    });
    if (nameTaken) {
      throw new BadRequestException('Username already taken');
    }

    const user = await prisma.user.create({ data: createUserDto });
    await prisma.profile.create({
      data: { bio: '', userId: user.id },
    });
  }

  async getUserProfile(visitorId: string, userName: string): Promise<object> {
    const user = await prisma.user.findUnique({ where: { name: userName } });
    if (user == null) {
      throw new NotFoundException('User ' + userName + ' not found');
    }
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    let role = 'Пользователь';
    if (user.isModerator && !user.isAdmin) {
      role = 'Модератор';
    }
    if (user.isAdmin) {
      role = 'Администратор';
    }

    let admin = false;
    let edit = false;
    if (visitorId != null) {
      const visitor = await prisma.user.findUnique({
        where: { id: visitorId },
      });
      if (visitor.isAdmin) {
        admin = true;
        edit = true;
      }
      if (user.id == visitor.id) {
        edit = true;
      }
    }

    return {
      title: user.name + ' - OpenForum',
      userName: user.name,
      userId: user.id,
      bio: profile.bio,
      role: role,
      admin: admin,
      edit: edit,
    };
  }

  async updateRole(userName: string, editRoleDto: EditRoleDto) {
    await prisma.user.update({
      where: { name: userName },
      data: editRoleDto,
    });
  }

  async updateBio(userName: string, updateBioDto: UpdateBioDto) {
    const user = await prisma.user.findUnique({ where: { name: userName } });

    await prisma.profile.update({
      where: { userId: user.id },
      data: updateBioDto,
    });
  }

  async deleteUser(userName: string) {
    const user = await prisma.user.findUnique({ where: { name: userName } });
    await deleteUser(user.id);
    await prisma.user.delete({ where: { id: user.id } });
  }

  async getLogin() {
    return { title: 'Авторизация - OpenForum' };
  }

  async getRegister() {
    return { title: 'Регистрация - OpenForum' };
  }
}
