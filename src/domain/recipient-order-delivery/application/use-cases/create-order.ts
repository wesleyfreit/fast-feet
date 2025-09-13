import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Order } from '../../enterprise/entities/order';
import { Address } from '../../enterprise/entities/value-objects/address';
import { OrdersRepository } from '../repositories/orders-repository';
import { RecipientPeopleRepository } from '../repositories/recipient-people-repository';

interface CreateOrderUseCaseRequest {
  recipientPersonId: string;
  city: string;
  street: string;
  neighborhood: string;
  state: string;
  zipCode: string;
  number: string;
  complement?: string;
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private recipientPeopleRepository: RecipientPeopleRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    recipientPersonId,
    city,
    street,
    neighborhood,
    state,
    zipCode,
    number,
    complement,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipientPerson =
      await this.recipientPeopleRepository.findById(recipientPersonId);

    if (!recipientPerson) {
      return left(new ResourceNotFoundError());
    }

    const order = Order.create({
      recipientPersonId: new UniqueEntityID(recipientPersonId),
      address: Address.create({
        city,
        street,
        neighborhood,
        state,
        zipCode,
        number,
        complement,
      }),
    });

    await this.ordersRepository.create(order);

    return right({
      order,
    });
  }
}
