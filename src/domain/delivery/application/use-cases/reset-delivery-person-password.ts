import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../cryptography/hash-generator';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';

interface ResetDeliveryPersonPasswordUseCaseRequest {
  deliveryPersonCpf: string;
  newPassword: string;
}

type ResetDeliveryPersonPasswordUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class ResetDeliveryPersonPasswordUseCase {
  constructor(
    private deliveryPeopleRepository: DeliveryPeopleRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    deliveryPersonCpf,
    newPassword,
  }: ResetDeliveryPersonPasswordUseCaseRequest): Promise<ResetDeliveryPersonPasswordUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPeopleRepository.findByCpf(deliveryPersonCpf);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword);

    deliveryPerson.password = hashedPassword;

    await this.deliveryPeopleRepository.save(deliveryPerson);

    return right(null);
  }
}
