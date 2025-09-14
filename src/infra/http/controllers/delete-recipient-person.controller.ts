import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-recipient-person';
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

const deleteRecipientPersonParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(deleteRecipientPersonParamSchema);

type RecipientPersonIdPathParam = z.infer<typeof deleteRecipientPersonParamSchema>;

@Controller('/recipients/:recipientPersonId')
export class DeleteRecipientPersonController {
  constructor(private deleteRecipientPerson: DeleteRecipientPersonUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('recipientPersonId', paramValidationPipe)
    recipientPersonId: RecipientPersonIdPathParam,
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
