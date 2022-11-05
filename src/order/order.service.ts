import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { CreateProductsInOrderDto } from './dto/create.productsinorder.dto';
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

  async deleteOrder(orderId: string) {
    await prisma.order.delete({ where: { id: orderId } });
  }

  async getOrder(orderId: string) {
    return await prisma.order.findUnique({ where: { id: orderId } });
  }

  async createProductsInOrder(
    createProductsInOrderDto: CreateProductsInOrderDto,
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
    const productsinorder = await prisma.productsInOrder.create({
      data: createProductsInOrderDto,
    });
    return { productsinorderId: productsinorder.id };
  }

  async deleteProductsInOrder(productsinorderId: string) {
    await prisma.productsInOrder.delete({ where: { id: productsinorderId } });
  }

  async getProductsInOrder(productsinorderId: string) {
    return await prisma.productsInOrder.findUnique({
      where: { id: productsinorderId },
    });
  }
}
