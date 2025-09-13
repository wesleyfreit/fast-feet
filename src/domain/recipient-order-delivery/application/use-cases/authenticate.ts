import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Role } from '../../enterprise/entities/enums/role';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hash-comparer';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
  cpf: string;
  password: string;
}

type AuthenticateUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private deliveryPeopleRepository: DeliveryPeopleRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const deliveryPerson = await this.deliveryPeopleRepository.findByCpf(cpf);

    if (!deliveryPerson) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryPerson.password,
    );

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt(
      {
        role: deliveryPerson.isAdmin ? Role.ADMIN : Role.USER,
      },
      {
        subject: deliveryPerson.id.toString(),
        expiresIn: '1d',
      },
    );

    return right({
      accessToken,
    });
  }
}
