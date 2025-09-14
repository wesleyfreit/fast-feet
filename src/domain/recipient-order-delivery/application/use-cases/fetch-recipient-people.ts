import { Either, right } from '@/core/logic/either';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Injectable } from '@nestjs/common';
import { RecipientPerson } from '../../enterprise/entities/recipient-person';
import { RecipientPeopleRepository } from '../repositories/recipient-people-repository';

interface FetchRecipientPeopleUseCaseRequest {
  pagination: PaginationParams;
}

type FetchRecipientPeopleUseCaseResponse = Either<
  null,
  PaginationResult<RecipientPerson, 'recipients'>
>;

@Injectable()
export class FetchRecipientPeopleUseCase {
  constructor(private recipientPeopleRepository: RecipientPeopleRepository) {}

  async execute({
    pagination,
  }: FetchRecipientPeopleUseCaseRequest): Promise<FetchRecipientPeopleUseCaseResponse> {
    const recipientPeople = await this.recipientPeopleRepository.findMany(pagination);

    return right(recipientPeople);
  }
}
