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
export class DeletePhotoGuard implements CanActivate {
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
    let photoId: string;
    try {
      photoId = path.split('/')[2];
    } catch (err) {
      throw new BadRequestException('Invalid photo id');
    }
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });
    if (photo == null) {
      throw new NotFoundException('Photo not found');
    }
    const product = await prisma.product.findUnique({
      where: { id: photo.product_id },
    });
    if (product == null) {
      throw new NotFoundException('Product not found');
    }
    const seller = await prisma.seller.findUnique({
      where: { id: product.seller_id },
    });
    const userId = session.getUserId();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && seller.user_id != userId) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
