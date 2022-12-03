import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import prisma from '../../client';

@Injectable()
export class DeleteProductsInOrderGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    let session: SessionContainer;
    try {
      session = await Session.getSession(
        httpContext.getRequest(),
        httpContext.getResponse(),
      );
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
    const path = httpContext.getRequest().path;
    let productsInOrderId: string;
    try {
      productsInOrderId = path.split('/')[2];
    } catch (err) {
      throw new BadRequestException('Invalid products in order id');
    }
    const productsInOrder = await prisma.productsInOrder.findUnique({
      where: { id: productsInOrderId },
    });
    if (productsInOrder == null) {
      throw new NotFoundException('Products in order not found');
    }
    const userId = session.getUserId();
    const order = await prisma.order.findFirst({
      where: { id: productsInOrder.order_id },
    });
    if (order == null) {
      throw new NotFoundException('Order not found');
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && order.user_id != userId) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
