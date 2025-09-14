import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-recipient-person';
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

const recipientPersonIdParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(recipientPersonIdParamSchema);

type RecipientPersonIdParam = z.infer<typeof recipientPersonIdParamSchema>;

@Controller('/recipients/:recipientPersonId')
@Roles(Role.ADMIN)
export class DeleteRecipientPersonController {
  constructor(private deleteRecipientPerson: DeleteRecipientPersonUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('recipientPersonId', paramValidationPipe)
    recipientPersonId: RecipientPersonIdParam,
  ) {
    const result = await this.deleteRecipientPerson.execute({
      recipientPersonId,
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
