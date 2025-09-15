import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliveryPersonAlreadyExistsError } from '@/domain/recipient-order-delivery/application/use-cases/errors/delivery-person-already-exists';
import { UpdateDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-delivery-person';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const updateDeliveryPersonBodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  cpf: z.string().min(11).max(11).optional(),
});

type UpdateDeliveryPersonBody = z.infer<typeof updateDeliveryPersonBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(updateDeliveryPersonBodySchema);

const deliveryPersonIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(deliveryPersonIdParamSchema);

type DeliveryPersonIdParam = z.infer<typeof deliveryPersonIdParamSchema>;

@Controller('/users/:deliveryPersonId')
@Roles(Role.ADMIN)
export class UpdateDeliveryPersonController {
  constructor(private updateDeliveryPerson: UpdateDeliveryPersonUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateDeliveryPersonBody,
    @Param('deliveryPersonId', paramValidationPipe)
    deliveryPersonId: DeliveryPersonIdParam,
  ) {
    const result = await this.updateDeliveryPerson.execute({
      deliveryPersonId,
      newName: body.name,
      newCpf: body.cpf,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case DeliveryPersonAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
