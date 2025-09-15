import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeliverOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/deliver-order';

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

const deliverOrderBodySchema = z.object({
  deliveryPersonId: z.uuid(),
  photoUrl: z.string().min(1),
});

type DeliverOrderBody = z.infer<typeof deliverOrderBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema);

const orderIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(orderIdParamSchema);

type OrderIdParam = z.infer<typeof orderIdParamSchema>;

@Controller('/orders/:orderId/deliver')
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: DeliverOrderBody,
    @Param('orderId', paramValidationPipe)
    orderId: OrderIdParam,
  ) {
    const result = await this.deliverOrder.execute({
      orderId,
      deliveryPersonId: body.deliveryPersonId,
      photoUrl: body.photoUrl,
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
