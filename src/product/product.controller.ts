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
  Patch,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create.product.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateReviewDto } from './dto/create.review.dto';
import { CreatePhotoDto } from './dto/create.photo.dto';
import { EditProductDto } from './dto/edit.product.dto';
import { CreateProductCategoryDto } from './dto/create.productcategory.dto';

@ApiTags('product')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Seller Guard
  @Post('/products')
  async createProduct(
    @SessionDecorator() session: SessionContainer,
    @Body() createProductDto: CreateProductDto,
  ): Promise<object> {
    return await this.productService.createProduct(createProductDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'Unique product id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  // TODO Seller Guard
  @Delete('products/:productId')
  async deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productService.deleteProduct(productId);
  }

  @ApiOperation({ summary: 'Get product' })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'Unique product id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('products/:productId')
  //@Render('product') // TODO Рендер страницы продукта
  async getProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<object> {
    return await this.productService.getProduct(productId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO create review guard (что id из сессии и из дто совпадают)
  @Post('reviews')
  async createReview(
    @SessionDecorator() session: SessionContainer,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.productService.createReview(createReviewDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete review' })
  @ApiParam({
    name: 'reviewId',
    type: 'string',
    description: 'Unique review id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  //@UseGuards(DeleteProductGuard)
  // TODO DeleteProductGuard дла автора отзыва, модератора или админа
  @Delete('reviews/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: string) {
    return await this.productService.deleteReview(reviewId);
  }

  @ApiOperation({ summary: 'Get review' })
  @ApiParam({
    name: 'reviewId',
    type: 'string',
    description: 'Unique review id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('reviews/:reviewId')
  //@Render('review') // TODO Рендер страницы с отзывом (?)
  async getReview(
    @SessionDecorator() session: SessionContainer,
    @Param('reviewId') reviewId: string,
  ): Promise<object> {
    return await this.productService.getReview(reviewId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Add new product photo' })
  @ApiBody({ type: CreatePhotoDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Seller guard
  @Post('photos')
  async createPhoto(
    @SessionDecorator() session: SessionContainer,
    @Body() createPhotoDto: CreatePhotoDto,
  ) {
    return await this.productService.createPhoto(createPhotoDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete product photo' })
  @ApiParam({ name: 'photoId', type: 'string', description: 'Unique photo id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  //@UseGuards(DeleteProductGuard)
  // TODO Seller guard
  @Delete('photos/:photoId')
  async deletePhoto(@Param('photoId') photoId: string) {
    return await this.productService.deletePhoto(photoId);
  }

  @ApiOperation({ summary: 'Get product photo' })
  @ApiParam({ name: 'photoId', type: 'string', description: 'Unique photo id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('photos/:photoId')
  //@Render('photo') // TODO Рендер страницы с картинкой (?)
  async getPhoto(
    @SessionDecorator() session: SessionContainer,
    @Param('photoId') photoId: string,
  ): Promise<object> {
    return await this.productService.getPhoto(photoId);
  }

  @ApiOperation({ summary: 'Edit product' })
  @ApiParam({
    name: 'productId',
    type: 'number',
    description: 'Unique product id',
  })
  @ApiBody({ type: EditProductDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  // TODO Edit product guard
  @Patch('products/:productId')
  async editProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() editProductDto: EditProductDto,
  ) {
    return await this.productService.editProduct(productId, editProductDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new product category' })
  @ApiBody({ type: CreateProductCategoryDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO create category guard - admin only
  @Post('productcategories')
  async createProductCategory(
    @SessionDecorator() session: SessionContainer,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return await this.productService.createProductCategory(createProductCategoryDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete product category' })
  @ApiParam({
    name: 'categoryId',
    type: 'string',
    description: 'Unique product category id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  // TODO category guard
  @Delete('productcategories/:categoryId')
  async deleteProductCategory(@Param('categoryId') categoryId: string) {
    return await this.productService.deleteProductCategory(categoryId);
  }

  @ApiOperation({ summary: 'Get product category' })
  @ApiParam({
    name: 'categoryId',
    type: 'string',
    description: 'Unique product category id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('productcategories/:categoryId')
  //@Render('product category') 
  async getProductCategory(
    @SessionDecorator() session: SessionContainer,
    @Param('categoryId') categoryId: string,
  ): Promise<object> {
    return await this.productService.getProductCategory(categoryId);
  }
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('productcategories/')
  //@Render('product category') 
  async getProductCategories(
    @SessionDecorator() session: SessionContainer,
  ): Promise<object> {
    return await this.productService.getProductCategories();
  }
}
