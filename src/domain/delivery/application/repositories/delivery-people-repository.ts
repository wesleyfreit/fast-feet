import { Administrator } from '../../enterprise/entities/administrator';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';

export abstract class DeliveryPeopleRepository {
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>;
  abstract findMany(): Promise<DeliveryPerson[]>;
  abstract findById(id: string): Promise<DeliveryPerson | Administrator | null>;
  abstract findByCpf(email: string): Promise<DeliveryPerson | Administrator | null>;
  abstract save(deliveryPerson: DeliveryPerson | Administrator): Promise<void>;
  abstract delete(deliveryPerson: DeliveryPerson | Administrator): Promise<void>;
}
