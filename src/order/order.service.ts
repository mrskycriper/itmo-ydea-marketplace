import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateProductsInOrderDto } from './dto/create.productsinorder.dto';
import prisma from '../client';
import { SetTimeSlotDto } from './dto/set.timeslot.dto';
import { SetAddressDto } from './dto/set.address.dto';
import { EditProductsInOrderDto } from './dto/edit.productsinorder.dto';

@Injectable()
export class OrderService {
  async createOrder(createOrderDto: CreateOrderDto): Promise<object> {
    const user = await prisma.user.findUnique({
      where: { id: createOrderDto.user_id },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const date = new Date(createOrderDto.start_timestamp);
    const order = await prisma.order.create({
      data: { start_timestamp: date, user_id: createOrderDto.user_id },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { current_order_id: order.id },
    });
    return await this.getOrder(order.id);
  }

  async getOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const productsInOrder = await prisma.productsInOrder.findMany({
      where: { order_id: orderId },
      include: { product: true },
    });
    let title = 'Заказ ' + order.id;
    if (order.status == 'COLLECTING') {
      title = 'Корзина';
    }

    return {
      title: title,
      order: order,
      productsInOrder: productsInOrder,
    };
  }

  async createProductsInOrder(
    createProductsInOrderDto: CreateProductsInOrderDto,
  ) {
    const product = await prisma.product.findUnique({
      where: { id: createProductsInOrderDto.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    const order = await prisma.order.findUnique({
      where: { id: createProductsInOrderDto.order_id },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'COLLECTING') {
      throw new BadRequestException('Order status is incorrect');
    }
    if (createProductsInOrderDto.number <= 0) {
      throw new BadRequestException('Product quantity must be above 0');
    }
    await prisma.productsInOrder.create({
      data: createProductsInOrderDto,
    });
    await prisma.order.update({
      where: { id: order.id },
      data: {
        sum:
          Number(order.sum) +
          createProductsInOrderDto.number * Number(product.price),
      },
    });
  }

  async removeProductFromOrder(productInOrderId: string) {
    const productInOrder = await prisma.productsInOrder.findUnique({
      where: { id: productInOrderId },
    });
    if (productInOrder == null) {
      throw new NotFoundException('ProductInOrder not found');
    }
    const order = await prisma.order.findUnique({
      where: { id: productInOrder.order_id },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'COLLECTING') {
      throw new BadRequestException('Order status is incorrect');
    }
    const product = await prisma.product.findUnique({
      where: { id: productInOrder.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    await prisma.productsInOrder.delete({ where: { id: productInOrderId } });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        sum: Number(order.sum) - productInOrder.number * Number(product.price),
      },
    });
  }

  async getShoppingCart(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const orderId = user.current_order_id;
    if (orderId == 0) {
      const createOrderDto = new CreateOrderDto(new Date(Date.now()), userId);
      return this.createOrder(createOrderDto);
    } else {
      return await this.getOrder(orderId);
    }
  }

  async getShoppingCartId(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const orderId = user.current_order_id;
    if (orderId == 0) {
      const createOrderDto = new CreateOrderDto(new Date(Date.now()), userId);
      const order = await this.createOrder(createOrderDto);
      const newUser = await prisma.user.findUnique({ where: { id: userId } });
      return {id: newUser.current_order_id};
    } else {
      return {id: orderId};
    }
  }

  async getOrders(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const orders = await prisma.order.findMany({ where: { user_id: userId } });
    return { title: 'Заказы', orders: orders };
  }

  async getTimeslots() {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + 3);
    const timeSlotMorning = new SetTimeSlotDto(
      new Date(date.setHours(9, 0, 0, 0)),
      new Date(date.setHours(11, 0, 0, 0)),
    );
    const timeSlotDay = new SetTimeSlotDto(
      new Date(date.setHours(13, 0, 0, 0)),
      new Date(date.setHours(15, 0, 0, 0)),
    );
    const timeSlotEvening = new SetTimeSlotDto(
      new Date(date.setHours(17, 0, 0, 0)),
      new Date(date.setHours(19, 0, 0, 0)),
    );
    return [timeSlotMorning, timeSlotDay, timeSlotEvening];
  }

  async setTimeslot(orderId: number, setTimeSlotDto: SetTimeSlotDto) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const address = order.address;
    if (address == null) {
      throw new BadRequestException('Order address is empty');
    }
    const status = order.status;
    if (status != 'PAID') {
      throw new BadRequestException('Order status is incorrect');
    }
    await prisma.order.update({
      where: { id: orderId },
      data: {
        timeslot_start: setTimeSlotDto.timeslot_start,
        timeslot_end: setTimeSlotDto.timeslot_end,
        status: 'SHIPPING',
      },
    });
  }

  async setAddress(orderId: number, setAddressDto: SetAddressDto) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'PAID') {
      throw new BadRequestException('Order status is incorrect');
    }
    await prisma.order.update({
      where: { id: orderId },
      data: setAddressDto,
    });
  }

  async bookOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const timesBooked = order.times_booked;
    if (timesBooked == 3) {
      throw new BadRequestException('Already has been booked three times');
    }
    const status = order.status;
    if (status != 'COLLECTING' && status != 'BOOKED') {
      throw new BadRequestException('Order status is incorrect');
    }

    const productsInOrder = await prisma.productsInOrder.findMany({
      where: { order_id: orderId },
    });
    for (const i of productsInOrder) {
      await this.bookProduct(i.id);
    }

    const newTimesBooked = timesBooked + 1;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'BOOKED',
        times_booked: newTimesBooked,
        start_timestamp: new Date(Date.now()),
      },
    });
    const userId = order.user_id;
    await prisma.user.update({
      where: { id: userId },
      data: {
        current_order_id: 0,
      },
    });
  }

  async unBookOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const userId = order.user_id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const cart = user.current_order_id;
    if (cart != 0) {
      throw new BadRequestException('This user already has an unbooked order');
    }
    const status = order.status;
    if (status != 'BOOKED') {
      throw new BadRequestException('Order status is incorrect');
    }

    const productsInOrder = await prisma.productsInOrder.findMany({
      where: { order_id: orderId },
      include: { product: true },
    });
    let sum = 0;
    for (const i of productsInOrder) {
      sum += i.number * Number(i.product.price);
      await this.unBookProduct(i.id);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COLLECTING',
        sum: sum,
      },
    });
  }

  async discardOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'COLLECTING' && status != 'BOOKED') {
      throw new BadRequestException('Order status is incorrect');
    }
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DISCARDED',
      },
    });
  }

  async payForOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'BOOKED') {
      throw new BadRequestException('Order status is incorrect');
    }
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
      },
    });

    const productsInOrder = await prisma.productsInOrder.findMany({
      where: { order_id: orderId },
      include: { product: true },
    });
    for (const i of productsInOrder) {
      await prisma.product.update({
        where: { id: i.product_id },
        data: {
          number: i.product.number - i.number,
          number_booked: i.product.number_booked - i.number,
        },
      });
    }
  }

  async bookProduct(productInOrderId: string) {
    const productInOrder = await prisma.productsInOrder.findUnique({
      where: { id: productInOrderId },
    });
    if (productInOrder == null) {
      throw new NotFoundException('ProductInOrder not found');
    }

    const product = await prisma.product.findUnique({
      where: { id: productInOrder.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }

    if (productInOrder.number > product.number - product.number_booked) {
      throw new BadRequestException('Not enough product in stock');
    }
    await prisma.product.update({
      where: { id: productInOrder.product_id },
      data: { number_booked: product.number_booked + productInOrder.number },
    });
  }

  async unBookProduct(productInOrderId: string) {
    const productInOrder = await prisma.productsInOrder.findUnique({
      where: { id: productInOrderId },
    });
    if (productInOrder == null) {
      throw new NotFoundException('ProductInOrder not found');
    }

    const product = await prisma.product.findUnique({
      where: { id: productInOrder.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }

    if (product.number_booked > productInOrder.number) {
      throw new BadRequestException('Booked products exceeded total quantity');
    }
    await prisma.product.update({
      where: { id: productInOrder.product_id },
      data: { number_booked: product.number_booked - productInOrder.number },
    });
  }

  async editProductInOrder(
    productInOrderId: string,
    editProductsInOrderDto: EditProductsInOrderDto,
  ) {
    const productInOrder = await prisma.productsInOrder.findUnique({
      where: { id: productInOrderId },
    });
    if (productInOrder == null) {
      throw new NotFoundException('ProductInOrder not found');
    }

    const product = await prisma.product.findUnique({
      where: { id: productInOrder.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }

    const order = await prisma.order.findUnique({
      where: { id: productInOrder.order_id },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'COLLECTING') {
      throw new BadRequestException('Order status is incorrect');
    }

    if (
      product.number - product.number_booked <
      editProductsInOrderDto.number
    ) {
      throw new BadRequestException('Not enough product in stock');
    }
    await prisma.productsInOrder.update({
      where: { id: productInOrderId },
      data: editProductsInOrderDto,
    });
    await prisma.order.update({
      where: { id: order.id },
      data: {
        sum:
          Number(order.sum) +
          Number(product.price) *
            (editProductsInOrderDto.number - productInOrder.number),
      },
    });
  }

  async refundOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'SHIPPING') {
      throw new BadRequestException('Order status is incorrect');
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'REFUND' },
    });
  }

  async completeOrder(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const status = order.status;
    if (status != 'SHIPPING') {
      throw new BadRequestException('Order status is incorrect');
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' },
    });
  }
}
