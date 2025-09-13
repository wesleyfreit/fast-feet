import { Either, right } from '@/core/logic/either';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Injectable } from '@nestjs/common';
import { Administrator } from '../../enterprise/entities/administrator';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import {
  DeliveryPeopleRepository,
  FilterParams,
} from '../repositories/delivery-people-repository';

interface FetchDeliveryPeopleUseCaseRequest {
  pagination: PaginationParams;
  filter?: FilterParams;
}

type FetchDeliveryPeopleUseCaseResponse = Either<
  null,
  PaginationResult<DeliveryPerson | Administrator, 'deliveryPeople'>
>;

@Injectable()
export class FetchDeliveryPeopleUseCase {
  constructor(private deliveryPeopleRepository: DeliveryPeopleRepository) {}

  async execute({
    pagination,
    filter,
  }: FetchDeliveryPeopleUseCaseRequest): Promise<FetchDeliveryPeopleUseCaseResponse> {
    const deliveryPeople = await this.deliveryPeopleRepository.findMany(
      pagination,
      filter,
    );

    return right(deliveryPeople);
  }
}
