import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { EnvService } from '../../env/env.service';

const userPayloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.nativeEnum(Role),
  iat: z.number(),
  exp: z.number(),
});

export type UserPayload = z.infer<typeof userPayloadSchema>;

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  validate(payload: UserPayload) {
    return userPayloadSchema.parse(payload);
  }
}
