import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import Session from 'supertokens-node/recipe/session';
import prisma from '../client';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    let session: SessionContainer;
    try {
      session = await Session.getSession(
        httpContext.getRequest(),
        httpContext.getResponse(),
      );
    } catch (err) {}

    const userId = session ? session.getUserId() : null;
    let userName = null;
    if (userId != null) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        userName = user.name;
      }
    }
    const authorised = !!session;
    return next.handle().pipe(
      map((data) => {
        return {
          ...data,
          userid: userId,
          username: userName,
          authorised: authorised,
        };
      }),
    );
  }
}
