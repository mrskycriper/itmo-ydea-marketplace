import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateChatDto } from './dto/create.chat.dto';
import { EditChatDto } from './dto/edit.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AccessChatGuard } from '../auth/guards/access.chat.guard';
import { InviteUserGuard } from '../auth/guards/invite.user.guard';
import { UninviteUserGuard } from '../auth/guards/uninvite.user.guard';

@ApiTags('chat')
@ApiCookieAuth()
@Controller()
export class ChatController {
  constructor(private readonly chatsService: ChatService) {}

  @ApiOperation({ summary: 'Get users chats' })
  @ApiQuery({
    name: 'page',
    type: 'string',
    description: 'Page selector',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('chats')
  @Render('chat-list')
  async getSomeChats(
    @SessionDecorator() session: SessionContainer,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<object> {
    return this.chatsService.getSomeChats(session.getUserId(), page);
  }

  @ApiOperation({ summary: 'Get chat' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Access Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AccessChatGuard)
  @Get('chats/:chatId')
  @Render('chat')
  async getChat(
    @SessionDecorator() session: SessionContainer,
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<object> {
    return this.chatsService.getChat(chatId, session.getUserId());
  }

  @ApiOperation({ summary: 'Create new chat' })
  @ApiBody({ type: CreateChatDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Post('chats')
  async createChat(
    @SessionDecorator() session: SessionContainer,
    @Body() createChatDto: CreateChatDto,
  ): Promise<object> {
    return this.chatsService.createChat(session.getUserId(), createChatDto);
  }

  @ApiOperation({ summary: 'Post new message' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('chats/:chatId')
  async postMessage(
    @SessionDecorator() session: SessionContainer,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatsService.postMessage(
      session.getUserId(),
      chatId,
      createMessageDto,
    );
  }

  @ApiOperation({ summary: 'Get chat settings' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Access Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AccessChatGuard)
  @Get('chats/:chatId/settings')
  @Render('chat-settings')
  async getSettings(
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<object> {
    return this.chatsService.getSettings(chatId);
  }

  @ApiOperation({ summary: 'Delete chat' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AccessChatGuard)
  @Delete('chats/:chatId')
  async deleteChat(@Param('chatId', ParseIntPipe) chatId: number) {
    return this.chatsService.deleteChat(chatId);
  }

  @ApiOperation({ summary: 'Invite user to chat' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Invited user id',
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(InviteUserGuard)
  @Post('chats/:chatId/invite/:userId')
  async inviteUser(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('userId') userId: string,
  ) {
    return this.chatsService.inviteUser(chatId, userId);
  }

  @ApiOperation({ summary: 'Remove user from chat' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Uninvited user id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(UninviteUserGuard)
  @Delete('chats/:chatId/invite/:userId')
  async removeUser(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('userId') userId: string,
  ) {
    return this.chatsService.removeUser(chatId, userId);
  }

  @ApiOperation({ summary: 'Edit chat name and description' })
  @ApiParam({
    name: 'chatId',
    type: 'string',
    description: 'Unique chat identifier',
  })
  @ApiBody({ type: EditChatDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @UseGuards(AccessChatGuard)
  @Put('chats/:chatId')
  async editChat(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() editChatDto: EditChatDto,
  ) {
    return this.chatsService.editChat(chatId, editChatDto);
  }
}
