import { FetchDeliveryPersonOrdersUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-delivery-person-orders';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { type UserPayload } from '@/infra/auth/jwt/jwt-auth.strategy';
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
const neighborhoodParamSchema = z.string().optional();

const pageQueryValidationPipe = new ZodValidationPipe(pageParamSchema);
const perPageQueryValidationPipe = new ZodValidationPipe(perPageParamSchema);
const neighborhoodQueryValidationPipe = new ZodValidationPipe(neighborhoodParamSchema);

type PageQueryParam = z.infer<typeof pageParamSchema>;
type PerPageQueryParam = z.infer<typeof perPageParamSchema>;
type NeighborhoodQueryParam = z.infer<typeof neighborhoodParamSchema>;

@Controller('/users/me/orders')
export class FetchDeliveryPersonOrdersController {
  constructor(private fetchDeliveryPersonOrders: FetchDeliveryPersonOrdersUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Query('perPage', perPageQueryValidationPipe) perPage: PerPageQueryParam,
    @Query('neighborhood', neighborhoodQueryValidationPipe)
    neighborhood: NeighborhoodQueryParam,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchDeliveryPersonOrders.execute({
      deliveryPersonId: user.sub,
      pagination: { page, perPage },
      neighborhood,
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
