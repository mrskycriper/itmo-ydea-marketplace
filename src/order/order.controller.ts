import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { SessionDecorator } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProductsInOrderDto } from './dto/create.productsinorder.dto';
import { SetTimeSlotDto } from './dto/set.timeslot.dto';
import { SetAddressDto } from './dto/set.address.dto';
import { EditProductsInOrderDto } from './dto/edit.productsinorder.dto';
import { CreateOrderGuard } from 'src/auth/guards/create.order.guard';
import { CreateProductsInOrderGuard } from 'src/auth/guards/create.productsinorder.guard';
import { EditGetOrderGuard } from 'src/auth/guards/editget.order.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

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
  @UseGuards(CreateOrderGuard)
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
  @UseGuards(CreateProductsInOrderGuard)
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
  //@UseGuards(DeleteProductsInOrderGuard)
  @Delete('productsInOrder/:productsInOrderId')
  async removeProductFromOrder(
    @Param('productsInOrderId') productsInOrderId: string,
  ) {
    return await this.orderService.removeProductFromOrder(productsInOrderId);
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get shopping cart' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('cart')
  @Render('cart')
  async getShoppingCart(@SessionDecorator() session: SessionContainer) {
    return await this.orderService.getShoppingCart(session.getUserId());
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get shopping cart id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('cartId')
  async getShoppingCartId(@SessionDecorator() session: SessionContainer) {
    return await this.orderService.getShoppingCartId(session.getUserId());
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get orders' })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'Page number',
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    type: 'number',
    description: 'Number of products per page',
    required: false,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Render('orders')
  @Get('orders')
  async getOrders(
    @SessionDecorator() session: SessionContainer,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(20), ParseIntPipe) perPage: number,
  ) {
    return await this.orderService.getOrders(
      session.getUserId(),
      page,
      perPage,
    );
  }

  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get order' })
  @ApiParam({ name: 'orderId', type: 'string', description: 'Unique order id' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard)
  @UseGuards(EditGetOrderGuard)
  @Get('orders/:orderId')
  @Render('order')
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
  @UseGuards(EditGetOrderGuard)
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
  @UseGuards(EditGetOrderGuard)
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
  @UseGuards(EditGetOrderGuard)
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
  @UseGuards(EditGetOrderGuard)
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
  @UseGuards(EditGetOrderGuard)
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
  @UseGuards(EditGetOrderGuard)
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
  //@UseGuards(EditProductsInOrderGuard)
  @Patch('productsInOrder/:productsInOrderId')
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
  @UseGuards(AdminGuard)
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
  @UseGuards(AdminGuard)
  @Patch('order/:orderId/complete')
  async completeOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.completeOrder(orderId);
  }
}
