import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateProductsinorderDto } from './dto/create.productsinorder.dto';
import prisma from '../client';

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

  async getShoppingCart() {
    return Promise.resolve(undefined);
    // TODO Вернуть текущий заказа или создать новый
  }

  async getOrders() {
    return Promise.resolve(undefined);
    // TODO Вернуть список заказов
  }

  async getTimeslots() {
    return Promise.resolve(undefined);
    // TODO Выдать таймслоты
  }

  async setTimeslot() {
    return Promise.resolve(undefined);
    // TODO Установить таймслот
  }

  async setAddress() {
    return Promise.resolve(undefined);
    // TODO Установить адрес
  }

  async bookOrder() {
    return Promise.resolve(undefined);
    // TODO Забронировать заказ
  }

  async unBookOrder() {
    return Promise.resolve(undefined);
    // TODO Разбронировать заказ
  }

  async reBookOrder() {
    return Promise.resolve(undefined);
    // TODO Продлить бронирование заказа
  }

  async discardOrder() {
    return Promise.resolve(undefined);
    // TODO Отменить заказ
  }

  async payForOrder() {
    return Promise.resolve(undefined);
    // TODO Оплатить заказ
  }
}
