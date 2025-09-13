import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public';
import { ROLES_KEY } from '../decorators/roles';
import { UserPayload } from '../jwt/jwt-auth.strategy';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || Object.values(Role);

    const request = context.switchToHttp().getRequest<Request>();

    const user = <UserPayload>request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
