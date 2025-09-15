import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { PickUpOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/pick-up-order';

import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const pickUpOrderBodySchema = z.object({
  deliveryPersonId: z.uuid(),
});

type PickUpOrderBody = z.infer<typeof pickUpOrderBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(pickUpOrderBodySchema);

const orderIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(orderIdParamSchema);

type OrderIdParam = z.infer<typeof orderIdParamSchema>;

@Controller('/orders/:orderId/pick-up')
export class PickUpOrderController {
  constructor(private pickUpOrder: PickUpOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: PickUpOrderBody,
    @Param('orderId', paramValidationPipe)
    orderId: OrderIdParam,
  ) {
    const result = await this.pickUpOrder.execute({
      orderId,
      deliveryPersonId: body.deliveryPersonId,
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
