import { Administrator } from '@/domain/recipient-order-delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/recipient-order-delivery/enterprise/entities/delivery-person';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';

export class DeliveryPersonPresenter {
  static toHTTP(deliveryPerson: DeliveryPerson | Administrator) {
    return {
      id: deliveryPerson.id.toString(),
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      createdAt: deliveryPerson.createdAt,
      role: deliveryPerson.isAdmin ? Role.ADMIN : Role.USER,
    };
  }
}
