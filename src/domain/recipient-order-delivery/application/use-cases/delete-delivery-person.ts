import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';

interface DeleteDeliveryPersonUseCaseRequest {
  deliveryPersonId: string;
}

type DeleteDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteDeliveryPersonUseCase {
  constructor(private deliveryPeopleRepository: DeliveryPeopleRepository) {}

  async execute({
    deliveryPersonId,
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse> {
    const deliveryPerson = await this.deliveryPeopleRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    if (deliveryPerson.isAdmin) {
      return left(new NotAllowedError());
    }

    await this.deliveryPeopleRepository.delete(deliveryPerson);

    return right(null);
  }
}
