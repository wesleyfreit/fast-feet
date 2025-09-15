import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Administrator } from '../../enterprise/entities/administrator';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';

interface GrantAdministratorAccessUseCaseRequest {
  deliveryPersonCpf: string;
}

type GrantAdministratorAccessUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    administrator: Administrator;
  }
>;

@Injectable()
export class GrantAdministratorAccessUseCase {
  constructor(private deliveryPeopleRepository: DeliveryPeopleRepository) {}

  async execute({
    deliveryPersonCpf,
  }: GrantAdministratorAccessUseCaseRequest): Promise<GrantAdministratorAccessUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPeopleRepository.findByCpf(deliveryPersonCpf);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    if (deliveryPerson.isAdmin) {
      return left(new NotAllowedError());
    }

    const administrator = Administrator.create(
      {
        name: deliveryPerson.name,
        cpf: deliveryPerson.cpf,
        password: deliveryPerson.password,
        createdAt: deliveryPerson.createdAt,
        updatedAt: new Date(),
      },
      deliveryPerson.id,
    );

    await this.deliveryPeopleRepository.save(administrator);

    return right({
      administrator,
    });
  }
}
