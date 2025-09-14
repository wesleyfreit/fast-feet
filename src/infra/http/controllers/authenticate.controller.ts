import { AuthenticateUseCase } from '@/domain/recipient-order-delivery/application/use-cases/authenticate';
import { InvalidCredentialsError } from '@/domain/recipient-order-delivery/application/use-cases/errors/invalid-credentials-error';
import { Public } from '@/infra/auth/decorators/public';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod/v4';

const authenticateBodySchema = z.object({
  cpf: z.string().min(11).max(11),
  password: z.string().min(6),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema);

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: AuthenticateBody) {
    const { cpf, password } = body;

    const result = await this.authenticate.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return {
      user: {
        access_token: accessToken,
      },
    };
  }
}
