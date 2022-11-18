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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProductsinorderDto } from './dto/create.productsinorder.dto';
import { SetTimeSlotDto } from './dto/set.timeslot.dto';
import { SetAddressDto } from './dto/set.address.dto';

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
  @ApiOperation({ summary: 'Add new product in order' })
  @ApiParam({ name: 'orderId', type: 'number', description: 'Unique order id' })
  @ApiBody({ type: CreateProductsinorderDto })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Post('orders/:orderId/products')
  async createProductsInOrder(
    @SessionDecorator() session: SessionContainer,
    @Body() createProductsInOrderDto: CreateProductsinorderDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<object> {
    /*if (session.getUserId() != order.userId) {
      throw new BadRequestException('userIds does not match');
    } check if the order belongs to the user?*/
    // TODO Guard
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
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Delete('orders/:orderId/products/:productsinorderId')
  async removeProductFromOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('productsinorderId') productsinorderId: string,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
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
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Delete('orders/:orderId')
  async deleteOrder(
    @SessionDecorator() session: SessionContainer,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.orderService.deleteOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get shopping cart' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('cart')
  @Render('cart') // TODO Рендер корзины
  async getShoppingCart(@SessionDecorator() session: SessionContainer) {
    return await this.orderService.getShoppingCart(session.getUserId());
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get orders' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('orders')
  @Render('orders') // TODO Рендер вида списка заказов пользователя
  async getOrders(@SessionDecorator() session: SessionContainer) {
    return await this.orderService.getOrders(session.getUserId());
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
  @Render('order') // TODO Рендер страницы заказа
  async getOrder(
    @SessionDecorator() session: SessionContainer,
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
  @Post('order/:orderId/timeslot')
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
  @Post('order/:orderId/address')
  async setAddress(
    @Body() setAddressDto: SetAddressDto,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.orderService.setAddress(orderId, setAddressDto);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Book order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Post('order/:orderId/book')
  async bookOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.bookOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Rebook order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Post('order/:orderId/rebook')
  async reBookOrder() {
    return await this.orderService.reBookOrder();
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Unbook order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Post('order/:orderId/unbook')
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
  @Post('order/:orderId/discard')
  async discardOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.discardOrder(orderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Pay for order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  // TODO Edit order guard (сравнить id юзера из сессии и заказа указанного в пути)
  @Post('order/:orderId/pay')
  async payForOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.payForOrder(orderId);
  }

  // TODO Добавить изменение количества товара в заказе
}
