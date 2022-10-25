import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  UseInterceptors,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { EditTopicDto } from './dto/edit.topic.dto';
import { TimerInterceptor } from '../timer-interceptor.service';
import { CreateTopicDto } from './dto/create.topic.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/lib/build/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('topic')
@UseInterceptors(TimerInterceptor)
@Controller()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: 'Get topic' })
  @ApiQuery({
    name: 'page',
    type: 'string',
    description: 'Page selector',
  })
  @ApiParam({ name: 'topicId', type: 'string', description: 'Unique topic id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('topics/:topicId')
  @Render('posts')
  async getTopic(
    @SessionDecorator() session: SessionContainer,
    @Query('page', ParseIntPipe) page: number,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    let userId = null;
    try {
      userId = session.getUserId();
    } catch (err) {}
    return await this.topicService.getTopic(userId, topicId, page);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get topic settings' })
  @ApiParam({ name: 'topicId', type: 'string', description: 'Unique topic id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AdminGuard)
  @Get('topics/:topicId/settings')
  @Render('topic-settings')
  async getSettings(
    @Param('topicId', ParseIntPipe) topicId: number,
  ): Promise<object> {
    return await this.topicService.getSettings(topicId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new topic' })
  @ApiBody({ type: CreateTopicDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('topics')
  async createTopic(@Body() createTopicDto: CreateTopicDto): Promise<object> {
    return await this.topicService.createTopic(createTopicDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete topic' })
  @ApiParam({ name: 'topicId', type: 'string', description: 'Unique topic id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AdminGuard)
  @Delete('topics/:topicId')
  async deleteTopic(@Param('topicId') topicId: number) {
    return await this.topicService.deleteTopic(topicId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Edit topics name and description' })
  @ApiParam({ name: 'topicId', type: 'string', description: 'Unique topic id' })
  @ApiBody({ type: EditTopicDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AdminGuard)
  @Put('topics/:topicId')
  async editTopic(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() editTopicDto: EditTopicDto,
  ) {
    return await this.topicService.editTopic(topicId, editTopicDto);
  }
}
