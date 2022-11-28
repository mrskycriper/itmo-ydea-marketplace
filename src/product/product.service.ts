import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';
import { CreateReviewDto } from './dto/create.review.dto';
import prisma from '../client';
import { CreatePhotoDto } from './dto/create.photo.dto';
import { EditProductDto } from './dto/edit.product.dto';
import { CreateProductCategoryDto } from './dto/create.productcategory.dto';

@Injectable()
export class ProductService {
  async createProduct(createProductDto: CreateProductDto): Promise<object> {
    const seller = await prisma.seller.findUnique({
      where: { id: createProductDto.seller_id },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    if(createProductDto.price <= 0){
      throw new BadRequestException('Price should be above zero')
    }
    if(createProductDto.number < 0){
      throw new BadRequestException('Product quantity shold not be below zero')
    }
    const product = await prisma.product.create({
      data: createProductDto,
    });
    return { productId: product.id };
  }

  async deleteProduct(productId: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    await prisma.product.delete({ where: { id: productId } });
  }

  async getProduct(productId: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }

    const photos = await prisma.photo.findMany({
      where: { product_id: productId },
    });

    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
    });

    return { product: product, photos: photos, reviews: reviews };
  }

  async createReview(createReviewDto: CreateReviewDto) {
    const product = await prisma.product.findUnique({
      where: { id: createReviewDto.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    const user = await prisma.user.findUnique({
      where: { id: createReviewDto.user_id },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
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
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (review == null) {
      throw new NotFoundException('Review not found');
    }
    return { review: review };
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
    const photo = await prisma.photo.findUnique({ where: { id: photoId } });
    if (photo == null) {
      throw new NotFoundException('Photo not found');
    }
    await prisma.photo.delete({ where: { id: photoId } });
  }

  async getPhoto(photoId: string) {
    const photo = await prisma.photo.findUnique({ where: { id: photoId } });
    if (photo == null) {
      throw new NotFoundException('Photo not found');
    }
    return { photo: photo };
  }

  async editProduct(productId: number, editProductDto: EditProductDto) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    if (editProductDto.price <= 0) {
      throw new BadRequestException('Price must be above 0');
    }
    if (editProductDto.number < 0) {
      throw new BadRequestException(
        'Product quantity must be above or equal to 0',
      );
    }
    const category = await prisma.product_category.findUnique({
      where: { id: editProductDto.category_id },
    });
    if (category == null) {
      throw new NotFoundException('Category not found');
    }
    const old_price = Number(product.price);
    await prisma.product.update({
      where: { id: productId },
      data: editProductDto,
    });
    if (Number(product.price) != editProductDto.price) {
      const productsInOrder = await prisma.productsInOrder.findMany({
        where: {
          product_id: productId,
          order: { status: 'COLLECTING' },
        },
        include: { order: true },
      });

      for (const productInOrder of productsInOrder) {
        await prisma.order.update({
          where: { id: productInOrder.order_id },
          data: {
            sum:
              Number(productInOrder.order.sum) +
              productInOrder.number * (editProductDto.price - old_price),
          },
        });
      }
    }
  }
  async createProductCategory(createProductCategoryDto: CreateProductCategoryDto) {
    const category = await prisma.product_category.findUnique({
      where: { category : createProductCategoryDto.category },
    });
    if (category != null) {
      throw new NotFoundException('Category name should be unique');
    }
    await prisma.product_category.create({ data: createProductCategoryDto });
  }

  async getProductCategory(categoryId: string) {
    const category = await prisma.product_category.findUnique({
      where: { id: categoryId },
    });
    if (category == null) {
      throw new NotFoundException('Category not found');
    }
    const products = await prisma.product.findMany({
      where: {category_id : categoryId}
    })
    return { category: category, products: products };
  }

  async getProductCategories() {
    const categories = await prisma.product_category.findMany({
    });
    return { categories: categories};
  }

  async deleteProductCategory(categoryId: string) {
    const category = await prisma.product_category.findUnique({
      where: { id: categoryId },
    });
    if (category == null) {
      throw new NotFoundException('Category not found');
    }
    const defaultCategory = await prisma.product_category.findUnique({
      where: { category:  'без категории'},
    });
    await prisma.product.updateMany({
      where: {category_id : categoryId},
      data:{
        category_id : defaultCategory.id,
      }
    })
    await prisma.product_category.delete({ where: { id: categoryId } });
  }

}
