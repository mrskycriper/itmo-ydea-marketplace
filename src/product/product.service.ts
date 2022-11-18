import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';
import { CreateReviewDto } from './dto/create.review.dto';
import prisma from '../client';
import { CreatePhotoDto } from './dto/create.photo.dto';
import { EditProductDto } from './dto/edit.product.dto';

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
    // TODO Переделать в нормальное получение данных для рендера
  }

  async createReview(createReviewDto: CreateReviewDto) {
    const product = await prisma.product.findUnique({
      where: { id: createReviewDto.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    await prisma.review.create({ data: createReviewDto });

    const aggregations = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        product_id: createReviewDto.product_id,
      },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { rating_average: aggregations._avg.rating },
    });
  }

  async deleteReview(reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (review == null) {
      throw new NotFoundException('Review not found');
    }

    const product = await prisma.product.findUnique({
      where: { id: review.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }

    await prisma.review.delete({ where: { id: reviewId } });

    const aggregations = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        product_id: product.id,
      },
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { rating_average: aggregations._avg.rating },
    });
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

  async editProduct(productId: number, editProductDto: EditProductDto) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    return await prisma.product.update({
      where: { id: productId },
      data: editProductDto,
    });
  }
}
