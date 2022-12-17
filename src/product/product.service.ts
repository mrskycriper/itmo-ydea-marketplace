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
import { EditProductCategoryDto } from './dto/edit.productcategory.dto';

@Injectable()
export class ProductService {
  async createProduct(createProductDto: CreateProductDto): Promise<object> {
    const seller = await prisma.seller.findUnique({
      where: { id: createProductDto.seller_id },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    if (createProductDto.price <= 0) {
      throw new BadRequestException('Price should be above zero');
    }
    if (createProductDto.number < 0) {
      throw new BadRequestException(
        'Product quantity should not be below zero',
      );
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

  async getProduct(productId: number, userId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    const seller = await prisma.seller.findUnique({
      where: { id: product.seller_id },
    });

    const photos = await prisma.photo.findMany({
      where: { product_id: productId },
    });

    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
      include: { user: true },
    });

    let user = null;
    if (userId != null) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    let edit = false;
    if (user != null) {
      if (user.id == seller.user_id || user.is_admin || user.is_moderator) {
        edit = true;
      }
    }
    return {
      title: product.name,
      product: product,
      photos: photos,
      reviews: reviews,
      edit: edit,
    };
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

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const category = await prisma.product_category.findUnique({
      where: { category: createProductCategoryDto.category },
    });
    if (category != null) {
      throw new BadRequestException('Product category name should be unique');
    }
    await prisma.product_category.create({ data: createProductCategoryDto });
  }

  async editProductCategory(
    categoryId: string,
    editProductCategoryDto: EditProductCategoryDto,
  ) {
    const category = await prisma.product_category.findUnique({
      where: { category: editProductCategoryDto.category },
    });
    if (category != null) {
      throw new BadRequestException('Product category name should be unique');
    }
    await prisma.product_category.update({
      where: { id: categoryId },
      data: editProductCategoryDto,
    });
  }

  async deleteProductCategory(categoryId: string) {
    const category = await prisma.product_category.findUnique({
      where: { id: categoryId },
    });
    if (category == null) {
      throw new NotFoundException('Product category not found');
    }
    const defaultCategory = await prisma.product_category.findUnique({
      where: { category: 'Без категории' },
    });
    if (category.id == defaultCategory.id) {
      throw new BadRequestException(
        'Unable to delete default product category',
      );
    }
    await prisma.product.updateMany({
      where: { category_id: categoryId },
      data: {
        category_id: defaultCategory.id,
      },
    });
    await prisma.product_category.delete({ where: { id: categoryId } });
  }

  async getCatalogue(
    seller_id = -1,
    product_category_id: string = null,
    price_sort = -1,
    rating_sort = -1,
    page = 0,
    perPage = 20,
  ) {
    if (seller_id != -1) {
      const seller = await prisma.seller.findUnique({
        where: { id: seller_id },
      });
      if (seller == null) {
        throw new NotFoundException('Seller not found');
      }
    }
    if (product_category_id != null) {
      const category = await prisma.product_category.findUnique({
        where: { id: product_category_id },
      });
      if (category == null) {
        throw new NotFoundException('Category not found');
      }
    }
    if (price_sort != -1 && price_sort != 0 && price_sort != 1) {
      throw new BadRequestException('Price sorting parameter is invalid.');
    }
    if (rating_sort != -1 && rating_sort != 0 && rating_sort != 1) {
      throw new BadRequestException('Rating sorting parameter is invalid.');
    }
    if (page <= 0) {
      throw new BadRequestException('Page number should be above zero.');
    }
    if (perPage <= 0) {
      throw new BadRequestException(
        'Number of product per page should be above zero.',
      );
    }
    const categories = await prisma.product_category.findMany({});
    const sellers = await prisma.seller.findMany({ include: { user: true } });
    const filters =
      Number(price_sort != -1) * 8 +
      Number(product_category_id != null) * 4 +
      Number(rating_sort != -1) * 2 +
      Number(seller_id != -1);
    let products = [];
    let sorting = 0;
    switch (filters) {
      case 0:
        products = await prisma.product.findMany({
          skip: (page - 1) * perPage,
          take: perPage,
        });
        return { products: products, categories: categories, sellers: sellers };
      case 1:
        products = await prisma.product.findMany({
          skip: (page - 1) * perPage,
          take: perPage,
          where: { seller_id: seller_id },
        });
        return { products: products, categories: categories, sellers: sellers };
      case 2:
        if (rating_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'asc',
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'desc',
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 3:
        if (rating_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'asc',
            },
            where: { seller_id: seller_id },
          });
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'desc',
            },
            where: { seller_id: seller_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 4:
        products = await prisma.product.findMany({
          skip: (page - 1) * perPage,
          take: perPage,
          where: { category_id: product_category_id },
        });
        return { products: products, categories: categories, sellers: sellers };
      case 5:
        products = await prisma.product.findMany({
          skip: (page - 1) * perPage,
          take: perPage,
          where: {
            category_id: product_category_id,
            seller_id: seller_id,
          },
        });
        return { products: products, categories: categories, sellers: sellers };
      case 6:
        if (rating_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'asc',
            },
            where: { category_id: product_category_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'desc',
            },
            where: { category_id: product_category_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 7:
        if (rating_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'asc',
            },
            where: {
              category_id: product_category_id,
              seller_id: seller_id,
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              rating_average: 'desc',
            },
            where: {
              category_id: product_category_id,
              seller_id: seller_id,
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 8:
        if (price_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'asc',
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'desc',
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 9:
        if (price_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'asc',
            },
            where: { seller_id: seller_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'desc',
            },
            where: { seller_id: seller_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 10:
        sorting = price_sort * 2 + rating_sort;
        switch (sorting) {
          case 0:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'asc' },
              ],
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 1:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'asc' },
              ],
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 2:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'desc' },
              ],
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 3:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'asc' },
              ],
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
        }
      case 11:
        sorting = price_sort * 2 + rating_sort;
        switch (sorting) {
          case 0:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'desc' },
              ],
              where: { seller_id: seller_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 1:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'asc' },
              ],
              where: { seller_id: seller_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 2:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'desc' },
              ],
              where: { seller_id: seller_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 3:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'asc' },
              ],
              where: { seller_id: seller_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
        }
      case 12:
        if (price_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'asc',
            },
            where: { category_id: product_category_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'desc',
            },
            where: { category_id: product_category_id },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 13:
        if (price_sort == 1) {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'asc',
            },
            where: {
              category_id: product_category_id,
              seller_id: seller_id,
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        } else {
          products = await prisma.product.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
              price: 'desc',
            },
            where: {
              category_id: product_category_id,
              seller_id: seller_id,
            },
          });
          return {
            products: products,
            categories: categories,
            sellers: sellers,
          };
        }
      case 14:
        sorting = price_sort * 2 + rating_sort;
        switch (sorting) {
          case 0:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'desc' },
              ],
              where: { category_id: product_category_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 1:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'asc' },
              ],
              where: { category_id: product_category_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 2:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'desc' },
              ],
              where: { category_id: product_category_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 3:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'asc' },
              ],
              where: { category_id: product_category_id },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
        }
      case 15:
        sorting = price_sort * 2 + rating_sort;
        switch (sorting) {
          case 0:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'desc' },
              ],
              where: {
                category_id: product_category_id,
                seller_id: seller_id,
              },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 1:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'desc',
                },
                { rating_average: 'asc' },
              ],
              where: {
                category_id: product_category_id,
                seller_id: seller_id,
              },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 2:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'desc' },
              ],
              where: {
                category_id: product_category_id,
                seller_id: seller_id,
              },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
          case 3:
            products = await prisma.product.findMany({
              skip: (page - 1) * perPage,
              take: perPage,
              orderBy: [
                {
                  price: 'asc',
                },
                { rating_average: 'asc' },
              ],
              where: {
                category_id: product_category_id,
                seller_id: seller_id,
              },
            });
            return {
              products: products,
              categories: categories,
              sellers: sellers,
            };
        }
    }
  }

  async getProductCategories() {
    const categories = await prisma.product_category.findMany({});
    return { categories: categories };
  }
}
