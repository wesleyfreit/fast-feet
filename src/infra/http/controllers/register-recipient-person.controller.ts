import { RecipientPersonAlreadyExistsError } from '@/domain/recipient-order-delivery/application/use-cases/errors/recipient-person-already-exists';
import { RegisterRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-recipient-person';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod/v4';

const registerRecipientPersonBodySchema = z.object({
  name: z.string(),
  cpf: z.string().min(11).max(11),
  email: z.email(),
});

type RegisterRecipientPersonBody = z.infer<typeof registerRecipientPersonBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerRecipientPersonBodySchema);

@Controller('/recipients')
@Roles(Role.ADMIN)
export class RegisterRecipientPersonController {
  constructor(private registerRecipientPerson: RegisterRecipientPersonUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RegisterRecipientPersonBody) {
    const { name, cpf, email } = body;

    const result = await this.registerRecipientPerson.execute({
      name,
      cpf,
      email,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RecipientPersonAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
