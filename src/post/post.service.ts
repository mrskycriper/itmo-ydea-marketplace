import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EditPostDto } from './dto/edit.post.dto';
import { CreateCommentDto } from './dto/create.comment.dto';
import { CreatePostDto } from './dto/create.post.dto';
import prisma from '../client';

@Injectable()
export class PostService {
  async createPost(createPostDto: CreatePostDto): Promise<object> {
    const topic = await prisma.topic.findUnique({
      where: { id: createPostDto.topic_id },
    });
    if (topic == null) {
      throw new NotFoundException('Topic not found');
    }
    const user = await prisma.user.findUnique({
      where: { id: createPostDto.user_id },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const post = await prisma.post.create({
      data: createPostDto,
    });
    return { postId: post.id };
  }

  async deletePost(postId: number) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    await prisma.post.delete({ where: { id: postId } });
  }

  async editPost(postId: number, editPostDto: EditPostDto) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    await prisma.post.update({ where: { id: postId }, data: editPostDto });
  }

  async getPost(userId: string, postId: number, page: number) {
    if (page < 1) {
      throw new BadRequestException('Invalid page number');
    }
    const take = 5;
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    let user = null;
    let edit = false;
    let canPost = false;
    if (userId != null) {
      user = await prisma.user.findUnique({ where: { id: userId } });
      canPost = true;
      if (post.user_id == user.id || user.is_admin || user.is_moderator) {
        edit = true;
      }
    }

    const comments = await prisma.comment.findMany({
      skip: (page - 1) * take,
      take: take,
      orderBy: { created_at: 'asc' },
      where: { post_id: postId },
      include: {
        author: true,
      },
    });
    let empty = true;
    if (Object.keys(comments).length != 0) {
      empty = false;
    }
    const commentsAll = await prisma.comment.findMany({
      where: { post_id: postId },
    });

    let pageCount = Math.ceil(commentsAll.length / take);
    if (pageCount == 0) {
      pageCount = 1;
    }
    if (page > pageCount) {
      throw new BadRequestException('Invalid page number');
    }

    const author = await prisma.user.findUnique({
      where: { id: post.user_id },
    });
    return {
      title: post.title + ' - Ydea',
      postTitle: post.title,
      postContent: post.content,
      createdAt: post.created_at,
      author: author,
      comments: comments,
      postId: postId,
      page: page,
      pageCount: pageCount,
      edit: edit,
      post: canPost,
      empty: empty,
    };
  }

  async createComment(createCommentDto: CreateCommentDto) {
    const post = await prisma.post.findUnique({
      where: { id: createCommentDto.post_id },
    });
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    const user = await prisma.user.findUnique({
      where: { id: createCommentDto.user_id },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    await prisma.comment.create({ data: createCommentDto });
  }

  async getSettings(postId: number) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post == null) {
      throw new NotFoundException('Post not found');
    }
    return {
      title: post.title + ' - Ydea',
      postTitle: post.title,
      postContent: post.content,
      postId: postId,
    };
  }
}
