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
  export class EditGetOrderGuard implements CanActivate {
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
      let orderId: number;
      try {
        orderId = Number.parseInt(path.split('/')[2]);
      } catch (err) {
        throw new BadRequestException('Invalid order id');
      }
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (order == null) {
        throw new NotFoundException('Order not found');
      }
      const userId = session.getUserId();
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user.is_admin && !user.is_moderator && order.user_id != userId) {
        throw new ForbiddenException('Forbidden');
      }
  
      return true;
    }
  }