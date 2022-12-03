import {
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
export class CreateProductsInOrderGuard implements CanActivate {
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
    const userId = session.getUserId();
    const orderId = httpContext.getRequest().body.order_id;
    const order = await prisma.order.findFirst({
      where: { id: orderId },
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
