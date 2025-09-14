import { FetchRecipientPeopleUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-recipient-people';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Roles } from '@/infra/auth/decorators/roles';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import z from 'zod/v4';
import { RecipientPersonPresenter } from '../presenters/recipient-person-presenter';

const pageParamSchema = z.coerce.number().optional().default(1).pipe(z.number().min(1));
const perPageParamSchema = z.coerce
  .number()
  .optional()
  .default(15)
  .pipe(z.number().min(1));

const pageQueryValidationPipe = new ZodValidationPipe(pageParamSchema);
const perPageQueryValidationPipe = new ZodValidationPipe(perPageParamSchema);

type PageQueryParam = z.infer<typeof pageParamSchema>;
type PerPageQueryParam = z.infer<typeof perPageParamSchema>;

@Controller('/recipients')
@Roles(Role.ADMIN)
export class FetchRecipientPeopleController {
  constructor(private fetchRecipientPeople: FetchRecipientPeopleUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParam,
    @Query('perPage', perPageQueryValidationPipe) perPage: PerPageQueryParam,
  ) {
    const result = await this.fetchRecipientPeople.execute({
      pagination: { page, perPage },
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      ...result.value,
      recipients: result.value.recipients.map((recipientPerson) =>
        RecipientPersonPresenter.toHTTP(recipientPerson),
      ),
    };
  }
}
