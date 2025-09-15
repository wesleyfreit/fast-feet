import { Order } from '@/domain/recipient-order-delivery/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      deliveryPersonId: order.deliveryPersonId ? order.deliveryPersonId.toString() : null,
      recipientPersonId: order.recipientPersonId.toString(),
      status: order.status,
      address: {
        street: order.address.street,
        number: order.address.number,
        neighborhood: order.address.neighborhood,
        complement: order.address.complement,
        state: order.address.state,
        city: order.address.city,
        zipCode: order.address.zipCode,
      },
      photoProof: order.photoProof,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
