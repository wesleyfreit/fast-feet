import { FetchDeliveryPeopleUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-delivery-people';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import z from 'zod/v4';
import { DeliveryPersonPresenter } from '../presenters/delivery-person-presenter';

const pageParamSchema = z.coerce.number().optional().default(1).pipe(z.number().min(1));
const perPageParamSchema = z.coerce
  .number()
  .optional()
  .default(15)
  .pipe(z.number().min(1));
const roleParamSchema = z.enum(Role).optional();

const pageQueryValidationPipe = new ZodValidationPipe(pageParamSchema);
const perPageQueryValidationPipe = new ZodValidationPipe(perPageParamSchema);
const roleQueryValidationPipe = new ZodValidationPipe(roleParamSchema);

type PageQueryParam = z.infer<typeof pageParamSchema>;
type PerPageQueryParam = z.infer<typeof perPageParamSchema>;
type RoleQueryParam = z.infer<typeof roleParamSchema>;

@Controller('/users')
@Roles(Role.ADMIN)
export class FetchDeliveryPeopleController {
  constructor(private fetchDeliveryPeople: FetchDeliveryPeopleUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Query('perPage', perPageQueryValidationPipe) perPage: PerPageQueryParam,
    @Query('role', roleQueryValidationPipe) role?: RoleQueryParam,
  ) {
    const isAdmin = role === Role.ADMIN ? true : role === Role.USER ? false : undefined;

    const result = await this.fetchDeliveryPeople.execute({
      pagination: { page, perPage },
      filter: { isAdmin },
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      ...result.value,
      users: result.value.users.map((deliveryPerson) =>
        DeliveryPersonPresenter.toHTTP(deliveryPerson),
      ),
    };
  }
}
