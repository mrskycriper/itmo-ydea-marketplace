import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Render,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { EditRoleDto } from './dto/edit.role.dto';
import { DeleteUserGuard } from '../auth/guards/delete.user.guard';
import { UpdateRoleGuard } from '../auth/guards/update.role.guard';
import { EditUserDto } from './dto/edit.user.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Change user role flags' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Unique user id',
  })
  @ApiBody({ type: EditRoleDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(UpdateRoleGuard)
  @Put('users/:userId/role')
  async updateRole(
    @Param('userId') userId: string,
    @Body() editRoleDto: EditRoleDto,
  ) {
    return await this.usersService.updateRole(userId, editRoleDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Change username' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Unique user id',
  })
  @ApiBody({ type: EditUserDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AdminGuard)
  //ToDo guard to check that it's the right user
  @Put('users/:userId/')
  async editUser(
    @Param('userId') userId: string,
    @Body() editUserDto: EditUserDto,
  ) {
    return await this.usersService.editUser(userId, editUserDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Unique user id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(DeleteUserGuard)
  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  @ApiOperation({ summary: 'Get login page' })
  @ApiOkResponse({ description: 'OK' })
  @Get('login')
  @Render('login')
  async renderLogin() {
    return await this.usersService.getLogin();
  }

  @ApiOperation({ summary: 'Get register page' })
  @ApiOkResponse({ description: 'OK' })
  @Get('register')
  @Render('register')
  async login() {
    return await this.usersService.getRegister();
  }

  @ApiOperation({ summary: 'Get user settings' })
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('user/settings')
  @Render('user-settings')
  async getSettings(@SessionDecorator() session: SessionContainer) {
    return await this.usersService.getSettings(session.getUserId());
  }

  @ApiOperation({ summary: 'Get product category editor page' })
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('category-editor')
  @Render('category-editor')
  async getCategoryEditor() {
    return await this.usersService.getCategoryEditor();
  }
}
