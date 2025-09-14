import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UpdateRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-recipient-person';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const updateRecipientPersonBodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional(),
  cpf: z.string().min(11).max(11).optional(),
});

type UpdateRecipientPersonBody = z.infer<typeof updateRecipientPersonBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(updateRecipientPersonBodySchema);

const deleteRecipientPersonParamSchema = z.uuid();

const paramValidationPipe = new ZodValidationPipe(deleteRecipientPersonParamSchema);

type RecipientPersonIdPathParam = z.infer<typeof deleteRecipientPersonParamSchema>;

@Controller('/recipients/:recipientPersonId')
export class UpdateRecipientPersonController {
  constructor(private updateRecipientPerson: UpdateRecipientPersonUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateRecipientPersonBody,
    @Param('recipientPersonId', paramValidationPipe)
    recipientPersonId: RecipientPersonIdPathParam,
  ) {
    const result = await this.updateRecipientPerson.execute({
      recipientPersonId,
      newName: body.name,
      newEmail: body.email,
      newCpf: body.cpf,
    });

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
