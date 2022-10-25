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

import { UpdateBioDto } from './dto/update.bio.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { CheckUsernameDto } from './dto/check.username.dto';
import { EditRoleDto } from './dto/edit.role.dto';
import { DeleteUserGuard } from '../auth/guards/delete.user.guard';
import { UpdateBioGuard } from '../auth/guards/update.bio.guard';
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

  @ApiOperation({ summary: 'Get user profile' })
  @ApiParam({
    name: 'userName',
    type: 'string',
    description: 'Unique user name',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('users/:userName')
  @Render('user-profile')
  async getUserProfile(
    @SessionDecorator() session: SessionContainer,
    @Param('userName') userName: string,
  ): Promise<object> {
    let userId = null;
    try {
      userId = session.getUserId();
    } catch (err) {}
    return await this.usersService.getUserProfile(userId, userName);
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
  @ApiOperation({ summary: 'Update user biography' })
  @ApiParam({
    name: 'userName',
    type: 'string',
    description: 'Unique user name',
  })
  @ApiBody({ type: UpdateBioDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(UpdateBioGuard)
  @Put('users/:userName/bio')
  async updateBio(
    @Param('userName') userName: string,
    @Body() updateBioDto: UpdateBioDto,
  ) {
    return await this.usersService.updateBio(userName, updateBioDto);
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
