import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  <T = unknown>(_: unknown, context: ExecutionContext): T => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as T;
  },
);
