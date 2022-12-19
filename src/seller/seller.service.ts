import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create.seller.dto';
import prisma from '../client';
import { UpdateSellerDto } from './dto/update.seller.dto';

@Injectable()
export class SellerService {
  async createSeller(createSellerDto: CreateSellerDto): Promise<object> {
    const user = await prisma.user.findUnique({
      where: { id: createSellerDto.user_id },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const seller = await prisma.seller.create({
      data: createSellerDto,
    });
    await prisma.user.update({
      where: { id: createSellerDto.user_id },
      data: {
        is_seller: true
      }
    });
    return { sellerId: seller.id };
  }

  async deleteSeller(sellerId: number) {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    await prisma.seller.delete({ where: { id: sellerId } });
  }

  async getSeller(sellerId: number) {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      include: { user: true },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    return {
      seller: seller,
    };
  }

  async getSellers() {
    const sellers = await prisma.seller.findMany();
    return {
      sellers: sellers,
    };
  }

  async updateSeller(sellerId: number, updateSellerDto: UpdateSellerDto) {
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }

    await prisma.seller.update({
      where: { id: sellerId },
      data: updateSellerDto,
    });
  }

  async getRegister() {
    return { title: 'Регистрация продавца - Ydea' };
  }
}
