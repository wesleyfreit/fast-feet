import { FetchOrdersUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-orders';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import z from 'zod/v4';
import { OrderPresenter } from '../presenters/order-presenter';

const pageParamSchema = z.coerce.number().optional().default(1).pipe(z.number().min(1));
const perPageParamSchema = z.coerce
  .number()
  .optional()
  .default(15)
  .pipe(z.number().min(1));
const deliveryPersonIdParamSchema = z.uuid().optional();
const recipientPersonIdParamSchema = z.uuid().optional();

const pageQueryValidationPipe = new ZodValidationPipe(pageParamSchema);
const perPageQueryValidationPipe = new ZodValidationPipe(perPageParamSchema);
const deliveryPersonIdQueryValidationPipe = new ZodValidationPipe(
  deliveryPersonIdParamSchema,
);
const recipientPersonIdQueryValidationPipe = new ZodValidationPipe(
  recipientPersonIdParamSchema,
);

type PageQueryParam = z.infer<typeof pageParamSchema>;
type PerPageQueryParam = z.infer<typeof perPageParamSchema>;
type DeliveryPersonIdQueryParam = z.infer<typeof deliveryPersonIdParamSchema>;
type RecipientPersonIdQueryParam = z.infer<typeof recipientPersonIdParamSchema>;

@Controller('/orders')
@Roles(Role.ADMIN)
export class FetchOrdersController {
  constructor(private fetchOrders: FetchOrdersUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Query('perPage', perPageQueryValidationPipe) perPage: PerPageQueryParam,
    @Query('deliveryPersonId', deliveryPersonIdQueryValidationPipe)
    deliveryPersonId?: DeliveryPersonIdQueryParam,
    @Query('recipientPersonId', recipientPersonIdQueryValidationPipe)
    recipientPersonId?: RecipientPersonIdQueryParam,
  ) {
    const result = await this.fetchOrders.execute({
      pagination: { page, perPage },
      filter: { deliveryPersonId, recipientPersonId },
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      ...result.value,
      orders: result.value.orders.map((order) => OrderPresenter.toHTTP(order)),
    };
  }
}
