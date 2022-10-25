import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Session, { SessionContainer } from 'supertokens-node/recipe/session';

export const SessionDecorator = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    let session: SessionContainer;
    try {
      session = await Session.getSession(
        ctx.switchToHttp().getRequest(),
        ctx.switchToHttp().getResponse(),
      );
    } catch (err) {}
    return session;
  },
);
