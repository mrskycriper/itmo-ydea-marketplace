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
import { CreateProductsinorderDto } from './dto/create.productsinorder.dto';

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
    // TODO Авторизация
    return await this.orderService.createOrder(createOrderDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Add new product in order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiBody({ type: CreateProductsinorderDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Post('orders/:orderId/products')
  async createProductsInOrder(
    @SessionDecorator() session: SessionContainer,
    @Body() createProductsInOrderDto: CreateProductsinorderDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<object> {
    /*if (session.getUserId() != createProductsInOrderDto.userId) {
      throw new BadRequestException('userIds does not match');
    } check if the order belongs to the user?*/
    // TODO Авторизация
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
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('orders/:orderId/products/:productsinorderId')
  async removeProductFromOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('productsinorderId') productsinorderId: string,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    // TODO Авторизация
    return await this.orderService.removeProductFromOrder(productsinorderId);
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
  async deleteOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    // TODO Авторизация
    return await this.orderService.deleteOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get shopping cart' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('cart')
  @Render('cart') // TODO вид корзины
  async getShoppingCart(@SessionDecorator() session: SessionContainer) {
    // TODO Авторизация и извлечение id
    return await this.orderService.getShoppingCart();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get orders' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('orders')
  @Render('orders') // TODO вид списка заказов
  async getOrders(@SessionDecorator() session: SessionContainer) {
    // TODO Авторизация и извлечение id
    return await this.orderService.getOrders();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('orders/:orderId')
  @Render('order') // TODO вид заказа
  async getOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<object> {
    // TODO Авторизация
    return await this.orderService.getOrder(orderId);
  }

  @ApiOperation({ summary: 'Get timeslots' })
  @ApiOkResponse({ description: 'OK' })
  @Get('timeslots')
  async getTimeslots() {
    return await this.orderService.getTimeslots();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Set timeslot' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/timeslot')
  async setTimeslot() {
    // TODO Авторизация
    return await this.orderService.setTimeslot();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Set address' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/address')
  async setAddress() {
    // TODO Авторизация
    return await this.orderService.setAddress();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Book order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/book')
  async bookOrder() {
    // TODO Авторизация
    return await this.orderService.bookOrder();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Rebook order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/rebook')
  async reBookOrder() {
    // TODO Авторизация
    return await this.orderService.reBookOrder();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Unbook order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/unbook')
  async unBookOrder() {
    // TODO Авторизация
    return await this.orderService.unBookOrder();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Discard order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/discard')
  async discardOrder() {
    // TODO Авторизация
    return await this.orderService.discardOrder();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Pay for order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('order/:orderId/pay')
  async payForOrder() {
    // TODO Авторизация
    return await this.orderService.payForOrder();
  }

  // @ApiOperation({ summary: 'Get product in order' })
  // @ApiParam({
  //   name: 'productsinorderId',
  //   type: 'string',
  //   description: 'Unique products in order id',
  // })
  // @ApiOkResponse({ description: 'OK' })
  // @ApiBadRequestResponse({ description: 'Bad Request' })
  // @ApiNotFoundResponse({ description: 'Not Found' })
  // @Get('productsinorders/:productsinorderId')
  // @Render('productsinorder')
  // async getProductsInOrder(
  //   @SessionDecorator() session: SessionContainer,
  //   @Param('productsinorderId', ParseIntPipe) productsinorderId: string,
  // ): Promise<object> {
  //   return await this.orderService.getProductsInOrder(productsinorderId);
  // }
}
