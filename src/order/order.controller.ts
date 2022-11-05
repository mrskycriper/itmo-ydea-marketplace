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
  BadRequestException,
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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProductsInOrderDto } from './dto/create.productsinorder.dto';
@ApiTags('order')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('/orders')
  async createOrder(
    @SessionDecorator() session: SessionContainer,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<object> {
    // if (session.getUserId() != createOrderDto.user_id) {
    //   throw new BadRequestException('userIds does not match');
    // }
    return await this.orderService.createOrder(createOrderDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('orders/:orderId')
  async deleteOrder(@Param('orderId', ParseIntPipe) orderId: string) {
    return await this.orderService.deleteOrder(orderId);
  }

  @ApiOperation({ summary: 'Get order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('orders/:orderId')
  @Render('order')
  async getOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('orderId', ParseIntPipe) orderId: string,
  ): Promise<object> {
    return await this.orderService.getOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new product in order' })
  @ApiBody({ type: CreateProductsInOrderDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('/productsinorders')
  async createProductsInOrder(
    @SessionDecorator() session: SessionContainer,
    @Body() createProductsInOrderDto: CreateProductsInOrderDto,
  ): Promise<object> {
    /*if (session.getUserId() != createProductsInOrderDto.userId) {
      throw new BadRequestException('userIds does not match');
    } check if the order belongs to the user?*/
    return await this.orderService.createProductsInOrder(
      createProductsInOrderDto,
    );
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete product in order' })
  @ApiParam({
    name: 'productsinorderId',
    type: 'string',
    description: 'Unique product in order id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('productsinorders/:productsinorderId')
  async deleteProductsInOrder(
    @Param('productsinorderId', ParseIntPipe) productsinorderId: string,
  ) {
    return await this.orderService.deleteProductsInOrder(productsinorderId);
  }

  @ApiOperation({ summary: 'Get product in order' })
  @ApiParam({
    name: 'productsinorderId',
    type: 'string',
    description: 'Unique products in order id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('productsinorders/:productsinorderId')
  @Render('productsinorder')
  async getProductsInOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('productsinorderId', ParseIntPipe) productsinorderId: string,
  ): Promise<object> {
    return await this.orderService.getProductsInOrder(productsinorderId);
  }
}
