import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { RecipientPerson } from '../../enterprise/entities/recipient-person';
import { RecipientPeopleRepository } from '../repositories/recipient-people-repository';
import { RecipientPersonAlreadyExistsError } from './errors/recipient-person-already-exists';

interface CreateRecipientPersonUseCaseRequest {
  name: string;
  cpf: string;
  email: string;
}

type CreateRecipientPersonUseCaseResponse = Either<
  RecipientPersonAlreadyExistsError,
  {
    recipientPerson: RecipientPerson;
  }
>;

@Injectable()
export class CreateRecipientPersonUseCase {
  constructor(private recipientPeopleRepository: RecipientPeopleRepository) {}

  async execute({
    name,
    cpf,
    email,
  }: CreateRecipientPersonUseCaseRequest): Promise<CreateRecipientPersonUseCaseResponse> {
    const recipientPersonWithSameCpf =
      await this.recipientPeopleRepository.findByCpf(cpf);

    const recipientPersonWithSameEmail =
      await this.recipientPeopleRepository.findByEmail(email);

    if (recipientPersonWithSameCpf || recipientPersonWithSameEmail) {
      return left(new RecipientPersonAlreadyExistsError());
    }

    const recipientPerson = RecipientPerson.create({
      name,
      cpf,
      email,
    });

    await this.recipientPeopleRepository.create(recipientPerson);

    return right({
      recipientPerson,
    });
  }
}
