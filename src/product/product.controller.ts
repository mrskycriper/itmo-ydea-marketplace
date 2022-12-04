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
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { EditProductDto } from './dto/edit.product.dto';
import { CreateProductCategoryDto } from './dto/create.productcategory.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateProductGuard } from 'src/auth/guards/create.product.guard';
import { EditDeleteProductGuard } from 'src/auth/guards/editdelete.product.guard';
import { CreateReviewGuard } from 'src/auth/guards/create.review.gard';
import { DeleteReviewGuard } from 'src/auth/guards/delete.review.guard';
import { CreatePhotoGuard } from 'src/auth/guards/create.photo.guard';
import { DeletePhotoGuard } from 'src/auth/guards/delete.photo.guard';

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
  @UseGuards(CreateProductGuard)
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
  @UseGuards(EditDeleteProductGuard)
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
  @Render('product')
  @Get('products/:productId')
  //@Render('product')
  async getProduct(
    @SessionDecorator() session: SessionContainer,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<object> {
    return await this.productService.getProduct(productId, session.getUserId());
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @UseGuards(CreateReviewGuard)
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
  @UseGuards(DeleteReviewGuard)
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
  @UseGuards(CreatePhotoGuard)
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
  @UseGuards(DeletePhotoGuard)
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
  //@Render('photo')
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
  @UseGuards(EditDeleteProductGuard)
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
  @UseGuards(AdminGuard)
  @Post('productcategories')
  async createProductCategory(
    @SessionDecorator() session: SessionContainer,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return await this.productService.createProductCategory(
      createProductCategoryDto,
    );
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
  @UseGuards(AdminGuard)
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

  @ApiOperation({ summary: 'Get catalogue' })
  @ApiQuery({
    name: 'seller_id',
    type: 'number',
    description: 'Seller id',
    required: false,
  })
  @ApiQuery({
    name: 'product_category_id',
    type: 'string',
    description: 'Product Category Id',
    required: false,
  })
  @ApiQuery({
    name: 'price_sort',
    type: 'number',
    description: 'Sorting by price',
    required: false,
  })
  @ApiQuery({
    name: 'rating_sort',
    type: 'number',
    description: 'Sorting by rating',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'Page number',
    required: true,
  })
  @ApiQuery({
    name: 'perPage',
    type: 'number',
    description: 'Number of products per page',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('products/')
  async getCatalogue(
    @Query('seller_id', new DefaultValuePipe(-1), ParseIntPipe)
    seller_id: number,
    @Query('product_category_id') product_category_id: string,
    @Query('price_sort', new DefaultValuePipe(-1), ParseIntPipe)
    price_sort: number,
    @Query('rating_sort', new DefaultValuePipe(-1), ParseIntPipe)
    rating_sort: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
  ) {
    return await this.productService.getCatalogue(
      seller_id,
      product_category_id,
      price_sort,
      rating_sort,
      page,
      perPage,
    );
  }
}
