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
export class CreateProductGuard implements CanActivate {
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
    const sellerId = httpContext.getRequest().body.seller_id;
    const seller = await prisma.seller.findFirst({
      where: { id: sellerId },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && seller.user_id != userId) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
