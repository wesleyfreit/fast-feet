import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UpdateDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-delivery-person';

import {
  BadRequestException,
  Body,
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

const deleteDeliveryPersonParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(deleteDeliveryPersonParamSchema);

type DeliveryPersonIdPathParam = z.infer<typeof deleteDeliveryPersonParamSchema>;

@Controller('/users/:deliveryPersonId')
export class UpdateDeliveryPersonController {
  constructor(private updateDeliveryPerson: UpdateDeliveryPersonUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateDeliveryPersonBody,
    @Param('deliveryPersonId', paramValidationPipe)
    deliveryPersonId: DeliveryPersonIdPathParam,
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
        default:
          throw new BadRequestException();
      }
    }
  }
}
