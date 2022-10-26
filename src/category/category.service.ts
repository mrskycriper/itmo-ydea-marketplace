import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create.category.dto';
import { EditCategoryDto } from './dto/edit.category.dto';
import prisma from '../client';

@Injectable()
export class CategoryService {
  async getCategories(userId: string, page: number) {
    if (page < 1) {
      throw new BadRequestException('Invalid page number');
    }
    const take = 5;
    let user = null;
    if (userId != null) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    const categories = await prisma.category.findMany({
      skip: (page - 1) * take,
      take: take,
      orderBy: { name: 'asc' },
    });
    let empty = true;
    if (Object.keys(categories).length != 0) {
      empty = false;
    }

    const categoriesAll = await prisma.category.findMany({});

    let pageCount = Math.ceil(categoriesAll.length / take);
    if (pageCount == 0) {
      pageCount = 1;
    }
    if (page > pageCount) {
      throw new BadRequestException('Invalid page number');
    }

    let admin = false;

    if (user) {
      if (user.isAdmin || user.isModerator) {
        admin = true;
      }
    }

    return {
      title: 'Категории - OpenForum',
      categories: categories,
      pageCount: pageCount,
      page: page,
      admin: admin,
      empty: empty,
    };
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<object> {
    const category = await prisma.category.create({ data: createCategoryDto });
    return { categoryId: category.id };
  }

  async deleteCategory(categoryId: number) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (category == null) {
      throw new NotFoundException('Category not found');
    }
    await prisma.category.delete({ where: { id: categoryId } });
  }

  async editCategory(categoryId: number, editCategoryDto: EditCategoryDto) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (category == null) {
      throw new NotFoundException('Category not found');
    }
    await prisma.category.update({
      where: { id: categoryId },
      data: editCategoryDto,
    });
  }

  async getCategory(userId: string, categoryId: number, page: number) {
    if (page < 1) {
      throw new BadRequestException('Invalid page number');
    }
    const take = 5;
    let edit = false;
    if (userId != null) {
      edit = true;
    }
    let admin = false;
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (user) {
      if (user.isAdmin || user.isModerator) {
        admin = true;
      }
    }
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (category == null) {
      throw new NotFoundException('Category not found');
    }

    const topics = await prisma.topic.findMany({
      skip: (page - 1) * take,
      take: take,
      where: { category_id: categoryId },
    });
    let empty = true;
    if (Object.keys(topics).length != 0) {
      empty = false;
    }

    const topicsAll = await prisma.topic.findMany({
      where: { category_id: categoryId },
    });

    let pageCount = Math.ceil(topicsAll.length / take);
    if (pageCount == 0) {
      pageCount = 1;
    }
    if (page > pageCount) {
      throw new BadRequestException('Invalid page number');
    }

    return {
      title: category.name + ' - OpenForum',
      categoryName: category.name,
      categoryId: category.id,
      topics: topics,
      pageCount: pageCount,
      page: page,
      edit: edit,
      admin: admin,
      empty: empty,
    };
  }

  async getSettings(categoryId: number) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    return {
      title: category.name + ' - OpenForum',
      categoryName: category.name,
      categoryId: category.id,
      categoryDescription: category.description,
    };
  }
}
