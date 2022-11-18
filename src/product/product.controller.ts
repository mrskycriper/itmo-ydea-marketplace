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
  Post,
  Put,
  Query,
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
    /*if (session.getUserId() != createProductDto.sellerId) {
      throw new BadRequestException('userIds does not match');
    } надо как-то дёргать из пользователя его sellerid */
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
  @Render('product') // TODO Рендер страницы продукта
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
  @Post('reviews')
  async createReview(
    @SessionDecorator() session: SessionContainer,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    // if (session.getUserId() != createReviewDto.user_id) {
    //   throw new BadRequestException('userIds does not match');
    // }
    // TODO Добавить проверку что id из сессии и из дто совпадают
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
  async deleteReview(@Param('reviewId', ParseIntPipe) reviewId: string) {
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
  @Render('review') // TODO Рендер страницы с отзывом (?)
  async getReview(
    @SessionDecorator() session: SessionContainer,
    @Param('reviewId', ParseIntPipe) reviewId: string,
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
  async deletePhoto(@Param('photoId', ParseIntPipe) photoId: string) {
    return await this.productService.deletePhoto(photoId);
  }

  @ApiOperation({ summary: 'Get product photo' })
  @ApiParam({ name: 'photoId', type: 'string', description: 'Unique photo id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('photos/:photoId')
  @Render('photo') // TODO Рендер страницы с картинкой (?)
  async getPhoto(
    @SessionDecorator() session: SessionContainer,
    @Param('photoId', ParseIntPipe) photoId: string,
  ): Promise<object> {
    return await this.productService.getPhoto(photoId);
  }

  // TODO Добавить редактирование свойств товара
}
