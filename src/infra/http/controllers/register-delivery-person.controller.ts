import { DeliveryPersonAlreadyExistsError } from '@/domain/recipient-order-delivery/application/use-cases/errors/delivery-person-already-exists';
import { RegisterDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-delivery-person';
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

const registerDeliveryPersonBodySchema = z.object({
  name: z.string(),
  cpf: z.string().min(11).max(11),
  password: z.string().min(6),
});

type RegisterDeliveryPersonBody = z.infer<typeof registerDeliveryPersonBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerDeliveryPersonBodySchema);

@Controller('/users')
@Roles(Role.ADMIN)
export class RegisterDeliveryPersonController {
  constructor(private registerDeliveryPerson: RegisterDeliveryPersonUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RegisterDeliveryPersonBody) {
    const { name, cpf, password } = body;

    const result = await this.registerDeliveryPerson.execute({
      name,
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeliveryPersonAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
