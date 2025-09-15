import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists';

interface UpdateDeliveryPersonUseCaseRequest {
  deliveryPersonId: string;
  newName?: string;
  newCpf?: string;
}

type UpdateDeliveryPersonUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class UpdateDeliveryPersonUseCase {
  constructor(private deliveryPeopleRepository: DeliveryPeopleRepository) {}

  async execute({
    deliveryPersonId,
    newName,
    newCpf,
  }: UpdateDeliveryPersonUseCaseRequest): Promise<UpdateDeliveryPersonUseCaseResponse> {
    const deliveryPerson = await this.deliveryPeopleRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    if (newCpf) {
      const deliveryPersonWithSameCpf =
        await this.deliveryPeopleRepository.findByCpf(newCpf);

      if (deliveryPersonWithSameCpf) {
        return left(new DeliveryPersonAlreadyExistsError());
      }

      deliveryPerson.cpf = newCpf;
    }

    deliveryPerson.name = newName ?? deliveryPerson.name;

    await this.deliveryPeopleRepository.save(deliveryPerson);

    return right(null);
  }
}
