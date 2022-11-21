import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
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

    await prisma.user.create({ data: createUserDto });
  }

  async updateRole(userName: string, editRoleDto: EditRoleDto) {
    await prisma.user.update({
      where: { name: userName },
      data: editRoleDto,
    });
  }

  async deleteUser(userName: string) {
    const user = await prisma.user.findUnique({ where: { name: userName } });
    await deleteUser(user.id);
    await prisma.user.delete({ where: { id: user.id } });
  }

  async getLogin() {
    return { title: 'Авторизация - Ydea' };
  }

  async getRegister() {
    return { title: 'Регистрация - Ydea' };
  }
}
