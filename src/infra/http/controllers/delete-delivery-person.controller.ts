import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-delivery-person';
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const deleteDeliveryPersonParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(deleteDeliveryPersonParamSchema);

type DeliveryPersonIdPathParam = z.infer<typeof deleteDeliveryPersonParamSchema>;

@Controller('/users/:deliveryPersonId')
export class DeleteDeliveryPersonController {
  constructor(private deleteDeliveryPerson: DeleteDeliveryPersonUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('deliveryPersonId', paramValidationPipe)
    deliveryPersonId: DeliveryPersonIdPathParam,
  ) {
    const result = await this.deleteDeliveryPerson.execute({
      deliveryPersonId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
