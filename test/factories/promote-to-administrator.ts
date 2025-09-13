import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';

export function promoteToAdministrator(
  deliveryPerson: DeliveryPerson,
  id: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
      password: deliveryPerson.password,
      createdAt: deliveryPerson.createdAt,
      updatedAt: new Date(),
      isAdmin: true,
    },
    id,
  );

  return administrator;
}
