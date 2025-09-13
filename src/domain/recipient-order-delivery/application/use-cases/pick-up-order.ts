import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Order } from '../../enterprise/entities/order';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface PickUpOrderUseCaseRequest {
  deliveryPersonId: string;
  orderId: string;
}

type PickUpOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class PickUpOrderUseCase {
  constructor(
    private deliveryPeopleRepository: DeliveryPeopleRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliveryPersonId,
    orderId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    const deliveryPerson = await this.deliveryPeopleRepository.findById(deliveryPersonId);

    if (!deliveryPerson || !order) {
      return left(new ResourceNotFoundError());
    }

    if (order?.deliveryPersonId) {
      return left(new NotAllowedError());
    }

    order.pickUp(new UniqueEntityID(deliveryPersonId));

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
