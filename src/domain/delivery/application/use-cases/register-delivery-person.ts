import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { HashGenerator } from '../cryptography/hash-generator';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists';

interface RegisterDeliveryPersonUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

type RegisterDeliveryPersonUseCaseResponse = Either<
  DeliveryPersonAlreadyExistsError,
  {
    deliveryPerson: DeliveryPerson;
  }
>;

@Injectable()
export class RegisterDeliveryPersonUseCase {
  constructor(
    private deliveryPeopleRepository: DeliveryPeopleRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseResponse> {
    const userWithSameCpf = await this.deliveryPeopleRepository.findByCpf(cpf);

    if (userWithSameCpf) {
      return left(new DeliveryPersonAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryPerson = DeliveryPerson.create({
      name,
      cpf,
      password: hashedPassword,
    });

    await this.deliveryPeopleRepository.create(deliveryPerson);

    return right({
      deliveryPerson,
    });
  }
}
