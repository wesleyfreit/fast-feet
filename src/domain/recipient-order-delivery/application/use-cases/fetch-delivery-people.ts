import { Either, right } from '@/core/logic/either';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Injectable } from '@nestjs/common';
import { Administrator } from '../../enterprise/entities/administrator';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import {
  DeliveryPeopleRepository,
  DeliveryPersonFilterParams,
} from '../repositories/delivery-people-repository';

interface FetchDeliveryPeopleUseCaseRequest {
  pagination: PaginationParams;
  filter?: DeliveryPersonFilterParams;
}

type FetchDeliveryPeopleUseCaseResponse = Either<
  null,
  PaginationResult<DeliveryPerson | Administrator, 'users'>
>;

@Injectable()
export class FetchDeliveryPeopleUseCase {
  constructor(private deliveryPeopleRepository: DeliveryPeopleRepository) {}

  async execute({
    pagination,
    filter = { isAdmin: false },
  }: FetchDeliveryPeopleUseCaseRequest): Promise<FetchDeliveryPeopleUseCaseResponse> {
    const deliveryPeople = await this.deliveryPeopleRepository.findMany(
      pagination,
      filter,
    );

    return right(deliveryPeople);
  }
}
