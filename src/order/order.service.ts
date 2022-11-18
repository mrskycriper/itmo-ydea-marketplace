import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateProductsinorderDto } from './dto/create.productsinorder.dto';
import prisma from '../client';
import { SetTimeSlotDto } from './dto/set.timeslot.dto';
import { SetAddressDto } from './dto/set.address.dto';

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
    return { orderId: order.id };
  }

  async deleteOrder(orderId: number) {
    await prisma.order.delete({ where: { id: orderId } });
  }

  async getOrder(orderId: number) {
    return await prisma.order.findUnique({ where: { id: orderId } });
  }

  async createProductsInOrder(
    createProductsInOrderDto: CreateProductsinorderDto,
  ): Promise<object> {
    const product = await prisma.product.findUnique({
      where: { id: createProductsInOrderDto.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    const orderForProducts = await prisma.order.findUnique({
      where: { id: createProductsInOrderDto.order_id },
    });
    if (orderForProducts == null) {
      throw new NotFoundException('Order not found');
    }
    return await prisma.productsInOrder.create({
      data: createProductsInOrderDto,
    });
  }

  async removeProductFromOrder(productsinorderId: string) {
    await prisma.productsInOrder.delete({ where: { id: productsinorderId } });
  }

  async getProductsInOrder(productsinorderId: string) {
    return await prisma.productsInOrder.findUnique({
      where: { id: productsinorderId },
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
    }
    return await prisma.order.findUnique({ where: { id: orderId } });
  }

  async getOrders(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    return await prisma.order.findMany({ where: { user_id: userId } });
    // TODO Вернуть список заказов
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
    await prisma.order.update({
      where: { id: orderId },
      data: setTimeSlotDto,
    });
  }

  async setAddress(orderId: number, setAddressDto: SetAddressDto) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
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
    // TODO Добавить бронирование товаров (product) при бронировании заказа
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
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COLLECTING',
      },
    });
    // TODO Разбронировать товары в заказе
  }

  async reBookOrder() {
    return Promise.resolve(undefined);
    // TODO Продлить бронирование заказа
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
  }
}
