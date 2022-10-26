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

import { CheckUsernameDto } from './dto/check.username.dto';
import { EditRoleDto } from './dto/edit.role.dto';
import { DeleteUserGuard } from '../auth/guards/delete.user.guard';
import { UpdateRoleGuard } from '../auth/guards/update.role.guard';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Check if username is already taken' })
  @ApiBody({ type: CheckUsernameDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('checkName')
  async isUsernameTaken(
    @Body() checkUsernameDto: CheckUsernameDto,
  ): Promise<object> {
    return await this.usersService.isUsernameTaken(checkUsernameDto.name);
  }

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
    name: 'userName',
    type: 'string',
    description: 'Unique user name',
  })
  @ApiBody({ type: EditRoleDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(UpdateRoleGuard)
  @Put('users/:userName/role')
  async updateRole(
    @Param('userName') userName: string,
    @Body() editRoleDto: EditRoleDto,
  ) {
    return await this.usersService.updateRole(userName, editRoleDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'userName',
    type: 'string',
    description: 'Unique user name',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(DeleteUserGuard)
  @Delete('users/:userName')
  async deleteUser(@Param('userName') userName: string) {
    return await this.usersService.deleteUser(userName);
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
}
