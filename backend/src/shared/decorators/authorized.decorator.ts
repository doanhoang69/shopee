import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';

export const Authorized = createParamDecorator(
  (_, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { sub } = request.user as JwtPayload;

    return sub;
  },
);
