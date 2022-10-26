import { BadRequestException, Injectable } from '@nestjs/common';
import { EditTopicDto } from './dto/edit.topic.dto';
import { CreateTopicDto } from './dto/create.topic.dto';
import prisma from '../client';

@Injectable()
export class TopicService {
  async createTopic(createTopicDto: CreateTopicDto): Promise<object> {
    const topic = await prisma.topic.create({ data: createTopicDto });
    return { topicId: topic.id };
  }

  async deleteTopic(topicId: number) {
    await prisma.topic.delete({ where: { id: topicId } });
  }

  async editTopic(topicId: number, editTopicDto: EditTopicDto) {
    await prisma.topic.update({ where: { id: topicId }, data: editTopicDto });
  }

  async getTopic(userId: string, topicId: number, page: number) {
    if (page < 1) {
      throw new BadRequestException('Invalid page number');
    }
    let user = null;
    let edit = false;
    if (userId != null) {
      user = await prisma.user.findUnique({ where: { id: userId } });
      edit = true;
    }
    let admin = false;

    if (user) {
      if (user.isAdmin || user.isModerator) {
        admin = true;
      }
    }
    const take = 5;
    const topic = await prisma.topic.findUnique({ where: { id: topicId } });

    const posts = await prisma.post.findMany({
      skip: (page - 1) * take,
      take: take,
      where: { topic_id: topicId },
    });
    let empty = true;
    if (Object.keys(posts).length != 0) {
      empty = false;
    }
    const postsAll = await prisma.post.findMany({
      where: { topic_id: topicId },
    });

    let pageCount = Math.ceil(postsAll.length / take);
    if (pageCount == 0) {
      pageCount = 1;
    }
    if (page > pageCount) {
      throw new BadRequestException('Invalid page number');
    }

    return {
      title: topic.name + ' - OpenForum',
      topicName: topic.name,
      topicId: topicId,
      posts: posts,
      pageCount: pageCount,
      page: page,
      edit: edit,
      admin: admin,
      empty: empty,
    };
  }

  async getSettings(topicId: number) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });
    return {
      title: topic.name + ' - OpenForum',
      topicName: topic.name,
      topicId: topic.id,
      topicDescription: topic.description,
    };
  }
}
