import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create.seller.dto';
import prisma from '../client';

@Injectable()
export class SellerService {
  async createSeller(createSellerDto: CreateSellerDto): Promise<object> {
    const user = await prisma.user.findUnique({
      where: { id: createSellerDto.userId },
    });
    if (user == null) {
      throw new NotFoundException('User not found');
    }
    const seller = await prisma.seller.create({
      data: createSellerDto,
    });
    return { sellerId: seller.id };
  }

  async deleteSeller(sellerId: number) {
    await prisma.seller.delete({ where: { id: sellerId } });
  }

  async getSeller(sellerId: number) {
    return await prisma.seller.findUnique({ where: { id: sellerId } });
  }
}
