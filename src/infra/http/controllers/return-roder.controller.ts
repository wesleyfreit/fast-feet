import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ReturnOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/return-order';

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

const returnOrderBodySchema = z.object({
  deliveryPersonId: z.uuid(),
});

type ReturnOrderBody = z.infer<typeof returnOrderBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(returnOrderBodySchema);

const orderIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(orderIdParamSchema);

type OrderIdParam = z.infer<typeof orderIdParamSchema>;

@Controller('/orders/:orderId/return')
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ReturnOrderBody,
    @Param('orderId', paramValidationPipe)
    orderId: OrderIdParam,
  ) {
    const result = await this.returnOrder.execute({
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
