import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ResetDeliveryPersonPasswordUseCase } from '@/domain/recipient-order-delivery/application/use-cases/reset-delivery-person-password';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const resetDeliveryPersonPasswordBodySchema = z.object({
  password: z.string().min(6),
});

type ResetDeliveryPersonPasswordBody = z.infer<
  typeof resetDeliveryPersonPasswordBodySchema
>;

const bodyValidationPipe = new ZodValidationPipe(resetDeliveryPersonPasswordBodySchema);

const deliveryPersonCpfParamSchema = z.string();

const paramValidationPipe = new ZodValidationPipe(deliveryPersonCpfParamSchema);

type DeliveryPersonCpfParam = z.infer<typeof deliveryPersonCpfParamSchema>;

@Controller('/users/:deliveryPersonCpf/password')
@Roles(Role.ADMIN)
export class ResetDeliveryPersonPasswordController {
  constructor(private resetDeliveryPersonPassword: ResetDeliveryPersonPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ResetDeliveryPersonPasswordBody,
    @Param('deliveryPersonCpf', paramValidationPipe)
    deliveryPersonCpf: DeliveryPersonCpfParam,
  ) {
    const result = await this.resetDeliveryPersonPassword.execute({
      deliveryPersonCpf,
      newPassword: body.password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
