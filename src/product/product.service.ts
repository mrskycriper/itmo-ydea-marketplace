import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';
import { CreateReviewDto } from './dto/create.review.dto';
import prisma from '../client';
import { CreatePhotoDto } from './dto/create.photo.dto';

@Injectable()
export class ProductService {
  async createProduct(createProductDto: CreateProductDto): Promise<object> {
    const seller = await prisma.seller.findUnique({
      where: { id: createProductDto.seller_id },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    const product = await prisma.product.create({
      data: createProductDto,
    });
    return { productId: product.id };
  }

  async deleteProduct(productId: number) {
    await prisma.product.delete({ where: { id: productId } });
  }

  async getProduct(productId: number) {
    return await prisma.product.findUnique({ where: { id: productId } });
  }

  async createReview(createReviewDto: CreateReviewDto) {
    const product = await prisma.product.findUnique({
      where: { id: createReviewDto.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    await prisma.review.create({ data: createReviewDto });
  }

  async deleteReview(reviewId: string) {
    await prisma.review.delete({ where: { id: reviewId } });
  }

  async getReview(reviewId: string) {
    return await prisma.review.findUnique({ where: { id: reviewId } });
  }

  async createPhoto(createPhotoDto: CreatePhotoDto) {
    const product = await prisma.product.findUnique({
      where: { id: createPhotoDto.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    await prisma.photo.create({ data: createPhotoDto });
  }

  async deletePhoto(photoId: string) {
    await prisma.photo.delete({ where: { id: photoId } });
  }

  async getPhoto(photoId: string) {
    return await prisma.photo.findUnique({ where: { id: photoId } });
  }
}
