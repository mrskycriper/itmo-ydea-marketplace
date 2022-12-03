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
export class SellerGuard implements CanActivate {
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
    let sellerId: number;
    try {
      sellerId = Number.parseInt(path.split('/')[2]);
    } catch (err) {
      throw new BadRequestException('Invalid seller id');
    }
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (seller == null) {
      throw new NotFoundException('Seller not found');
    }
    const userId = session.getUserId();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && seller.user_id != userId) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
