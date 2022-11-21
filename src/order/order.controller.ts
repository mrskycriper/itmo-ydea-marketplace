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
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { SetTimeSlotDto } from './dto/set.timeslot.dto';
import { SetAddressDto } from './dto/set.address.dto';
import { EditProductsInOrderDto } from './dto/edit.productsinorder.dto';

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
  // TODO create order guard (сравнить id юзера из сессии и дто)
  @Post('/orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<object> {
    return await this.orderService.createOrder(createOrderDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Add new product in order' })
  @ApiBody({ type: CreateProductsInOrderDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Post('productsInOrder')
  async createProductsInOrder(
    @Body() createProductsInOrderDto: CreateProductsInOrderDto,
  ) {
    return await this.orderService.createProductsInOrder(
      createProductsInOrderDto,
    );
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete product in order' })
  @ApiParam({
    name: 'productsInOrderId',
    type: 'string',
    description: 'Unique product in order id',
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Delete('productsInOrder/:productsInOrderId')
  async removeProductFromOrder(
    @Param('productsInOrderId') productsInOrderId: string,
  ) {
    return await this.orderService.removeProductFromOrder(productsInOrderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get shopping cart' })
  @ApiQuery({ name: 'userId', type: 'string', description: 'Unique user id' })
  // TODO Временное решение, потом удалить
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('cart')
  // @Render('cart') // TODO Рендер корзины
  async getShoppingCart(
    @SessionDecorator() session: SessionContainer,
    @Query('userId') userId: string,
    // TODO Временное решение, потом удалить
  ) {
    return await this.orderService.getShoppingCart(
      userId /*session.getUserId()*/,
    );
    // TODO Временное решение, потом удалить
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get orders' })
  @ApiQuery({ name: 'userId', type: 'string', description: 'Unique user id' })
  // TODO Временное решение, потом удалить
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('orders')
  //@Render('orders') // TODO Рендер вида списка заказов пользователя
  async getOrders(
    @SessionDecorator() session: SessionContainer,
    @Query('userId') userId: string,
    // TODO Временное решение, потом удалить
  ) {
    return await this.orderService.getOrders(userId /*session.getUserId()*/);
    // TODO Временное решение, потом удалить
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Get('orders/:orderId')
  // @Render('order') // TODO Рендер страницы заказа
  async getOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<object> {
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
  @ApiBody({ type: SetTimeSlotDto })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/timeslot')
  async setTimeslot(
    @Body() setTimeSlotDto: SetTimeSlotDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.orderService.setTimeslot(orderId, setTimeSlotDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Set address' })
  @ApiBody({ type: SetAddressDto })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/address')
  async setAddress(
    @Body() setAddressDto: SetAddressDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.orderService.setAddress(orderId, setAddressDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Book order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/book')
  async bookOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.bookOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Unbook order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/unbook')
  async unBookOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.unBookOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Discard order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/discard')
  async discardOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.discardOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Pay for order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/pay')
  async payForOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.payForOrder(orderId);
  }

  @ApiOperation({ summary: 'Edit productsInOrder' })
  @ApiParam({
    name: 'productsInOrderId',
    type: 'string',
    description: 'Unique product in order id',
  })
  @ApiBody({ type: EditProductsInOrderDto })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  // TODO Edit order guard
  @Patch('orders/:orderId/products/:productsInOrderId')
  async editProductInOrder(
    @Param('productsInOrderId') productsInOrderId: string,
    @Body() editProductsInOrderDto: EditProductsInOrderDto,
  ) {
    return await this.orderService.editProductInOrder(
      productsInOrderId,
      editProductsInOrderDto,
    );
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Refund order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/refund')
  async refundOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.refundOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Complete order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Patch('order/:orderId/complete')
  async completeOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.completeOrder(orderId);
  }
}
