import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { RecipientPeopleRepository } from '../repositories/recipient-people-repository';

interface UpdateRecipientPersonUseCaseRequest {
  recipientPersonId: string;
  newName?: string;
  newCpf?: string;
  newEmail?: string;
}

type UpdateRecipientPersonUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class UpdateRecipientPersonUseCase {
  constructor(private recipientPeopleRepository: RecipientPeopleRepository) {}

  async execute({
    recipientPersonId,
    newName,
    newCpf,
    newEmail,
  }: UpdateRecipientPersonUseCaseRequest): Promise<UpdateRecipientPersonUseCaseResponse> {
    const recipientPerson =
      await this.recipientPeopleRepository.findById(recipientPersonId);

    if (!recipientPerson) {
      return left(new ResourceNotFoundError());
    }

    if (newCpf) {
      const recipientPersonWithSameCpf =
        await this.recipientPeopleRepository.findByCpf(newCpf);

      if (recipientPersonWithSameCpf) {
        return left(new NotAllowedError());
      }

      recipientPerson.cpf = newCpf;
    }

    if (newEmail) {
      const recipientPersonWithSameEmail =
        await this.recipientPeopleRepository.findByEmail(newEmail);

      if (recipientPersonWithSameEmail) {
        return left(new NotAllowedError());
      }

      recipientPerson.email = newEmail;
    }

    recipientPerson.name = newName ?? recipientPerson.name;

    await this.recipientPeopleRepository.save(recipientPerson);

    return right(null);
  }
}
