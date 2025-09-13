import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { RecipientPeopleRepository } from '../repositories/recipient-people-repository';

interface DeleteRecipientPersonUseCaseRequest {
  recipientPersonId: string;
}

type DeleteRecipientPersonUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteRecipientPersonUseCase {
  constructor(private recipientPeopleRepository: RecipientPeopleRepository) {}

  async execute({
    recipientPersonId,
  }: DeleteRecipientPersonUseCaseRequest): Promise<DeleteRecipientPersonUseCaseResponse> {
    const recipientPerson =
      await this.recipientPeopleRepository.findById(recipientPersonId);

    if (!recipientPerson) {
      return left(new ResourceNotFoundError());
    }

    await this.recipientPeopleRepository.delete(recipientPerson);

    return right(null);
  }
}
