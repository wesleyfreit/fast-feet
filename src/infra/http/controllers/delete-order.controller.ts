import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-order';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const orderIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(orderIdParamSchema);

type OrderIdParam = z.infer<typeof orderIdParamSchema>;

@Controller('/orders/:orderId')
@Roles(Role.ADMIN)
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('orderId', paramValidationPipe)
    orderId: OrderIdParam,
  ) {
    const result = await this.deleteOrder.execute({
      orderId,
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
