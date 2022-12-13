import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { log } from 'node:console';

import Session, { SessionContainer } from 'supertokens-node/recipe/session';
import prisma from '../../client';

@Injectable()
export class CreateReviewGuard implements CanActivate {
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
    const dtoUserId = httpContext.getRequest().body.user_id;
    const dtoUser = await prisma.user.findFirst({
      where: { id: dtoUserId },
    });
    if (dtoUser == null) {
      throw new NotFoundException('User not found');
    }
    const userId = session.getUserId();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && dtoUser.id != userId) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
