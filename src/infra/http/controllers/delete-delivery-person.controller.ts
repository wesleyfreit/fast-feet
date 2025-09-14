import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-delivery-person';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
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

const deliveryPersonIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(deliveryPersonIdParamSchema);

type DeliveryPersonIdParam = z.infer<typeof deliveryPersonIdParamSchema>;

@Controller('/users/:deliveryPersonId')
@Roles(Role.ADMIN)
export class DeleteDeliveryPersonController {
  constructor(private deleteDeliveryPerson: DeleteDeliveryPersonUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('deliveryPersonId', paramValidationPipe)
    deliveryPersonId: DeliveryPersonIdParam,
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
