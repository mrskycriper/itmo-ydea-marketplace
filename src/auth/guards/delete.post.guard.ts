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
export class DeletePostGuard implements CanActivate {
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
    let postId: number;
    try {
      postId = Number.parseInt(path.split('/')[2]);
    } catch (err) {
      throw new BadRequestException('Invalid post id');
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    if (post == null) {
      throw new NotFoundException('Post not found');
    }

    const userId = session.getUserId();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.is_admin && !user.is_moderator && post.user_id != userId) {
      throw new ForbiddenException('Forbidden operation');
    }

    return true;
  }
}
