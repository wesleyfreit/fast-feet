import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { GrantAdministratorAccessUseCase } from '@/domain/recipient-order-delivery/application/use-cases/grant-administrator-access';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';

import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const deliveryPersonCpfParamSchema = z.string().min(11).max(11);

const paramValidationPipe = new ZodValidationPipe(deliveryPersonCpfParamSchema);

type DeliveryPersonCpfParam = z.infer<typeof deliveryPersonCpfParamSchema>;

@Controller('/users/:deliveryPersonCpf/grant-admin')
@Roles(Role.ADMIN)
export class GrantAdministratorAccessController {
  constructor(private grantAdministratorAccess: GrantAdministratorAccessUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('deliveryPersonCpf', paramValidationPipe)
    deliveryPersonCpf: DeliveryPersonCpfParam,
  ) {
    const result = await this.grantAdministratorAccess.execute({
      deliveryPersonCpf,
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
