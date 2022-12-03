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
export class DeleteReviewGuard implements CanActivate {
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
    let reviewId: string;
    try {
      reviewId = path.split('/')[2];
    } catch (err) {
      throw new BadRequestException('Invalid review id');
    }
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (review == null) {
      throw new NotFoundException('Review not found');
    }
    const userId = session.getUserId();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && review.user_id != userId) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
