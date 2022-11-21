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
import {
  BadRequestException,
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
import { PostService } from './post.service';
import { EditPostDto } from './dto/edit.post.dto';
import { CreatePostDto } from './dto/create.post.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DeletePostGuard } from '../auth/guards/delete.post.guard';
import { CreateCommentDto } from './dto/create.comment.dto';

@ApiTags('post')
@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('/posts')
  async createPost(
    @SessionDecorator() session: SessionContainer,
    @Body() createPostDto: CreatePostDto,
  ): Promise<object> {
    if (session.getUserId() != createPostDto.user_id) {
      throw new BadRequestException('userIds does not match');
    }
    return await this.postService.createPost(createPostDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'postId', type: 'number', description: 'Unique post id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(DeletePostGuard)
  @Delete('posts/:postId')
  async deletePost(@Param('postId', ParseIntPipe) postId: number) {
    return await this.postService.deletePost(postId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Edit post' })
  @ApiParam({ name: 'postId', type: 'number', description: 'Unique post id' })
  @ApiBody({ type: EditPostDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(DeletePostGuard)
  @Put('posts/:postId')
  async editPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() editPostDto: EditPostDto,
  ) {
    return await this.postService.editPost(postId, editPostDto);
  }

  @ApiOperation({ summary: 'Get post' })
  @ApiParam({ name: 'postId', type: 'number', description: 'Unique post id' })
  @ApiQuery({
    name: 'page',
    type: 'string',
    description: 'Page selector',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('posts/:postId')
  @Render('post')
  async getPost(
    @SessionDecorator() session: SessionContainer,
    @Param('postId', ParseIntPipe) postId: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<object> {
    let userId = null;
    try {
      userId = session.getUserId();
    } catch (err) {}
    return await this.postService.getPost(userId, postId, page);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('comments')
  async createComment(
    @SessionDecorator() session: SessionContainer,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    if (session.getUserId() != createCommentDto.user_id) {
      throw new BadRequestException('userIds does not match');
    }
    return await this.postService.createComment(createCommentDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get post settings' })
  @ApiParam({
    name: 'postId',
    type: 'string',
    description: 'Unique post identifier',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(DeletePostGuard)
  @Get('posts/:postId/settings')
  @Render('post-settings')
  async getSettings(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<object> {
    return await this.postService.getSettings(postId);
  }
}
