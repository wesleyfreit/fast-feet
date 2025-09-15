import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CreateOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/create-order';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod/v4';

const createOrderBodySchema = z.object({
  recipientPersonId: z.uuid(),
  city: z.string(),
  street: z.string(),
  number: z.string().min(1).max(10),
  complement: z.string().max(100).optional(),
  neighborhood: z.string(),
  state: z.string().length(2),
  zipCode: z.string().length(8),
});

type CreateOrderBody = z.infer<typeof createOrderBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema);

@Controller('/orders')
@Roles(Role.ADMIN)
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateOrderBody) {
    const result = await this.createOrder.execute(body);

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
