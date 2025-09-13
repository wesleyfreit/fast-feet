import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Order } from '../../enterprise/entities/order';
import { DeliveryPeopleRepository } from '../repositories/delivery-people-repository';
import { OrdersRepository } from '../repositories/orders-repository';

interface DeliverOrderUseCaseRequest {
  deliveryPersonId: string;
  orderId: string;
  photoUrl: string;
}

type DeliverOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private deliveryPeopleRepository: DeliveryPeopleRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliveryPersonId,
    orderId,
    photoUrl,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    const deliveryPerson = await this.deliveryPeopleRepository.findById(deliveryPersonId);

    if (!deliveryPerson || !order) {
      return left(new ResourceNotFoundError());
    }

    if (!order?.deliveryPersonId) {
      return left(new NotAllowedError());
    }

    if (!deliveryPerson.id.equals(order.deliveryPersonId)) {
      return left(new NotAllowedError());
    }

    order.deliver(photoUrl);

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
