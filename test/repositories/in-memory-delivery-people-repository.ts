import { DeliveryPeopleRepository } from '@/domain/delivery/application/repositories/delivery-people-repository';
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';

export class InMemoryDeliveryPeopleRepository implements DeliveryPeopleRepository {
  public items: (DeliveryPerson | Administrator)[] = [];

  async create(deliveryPerson: DeliveryPerson): Promise<void> {
    this.items.push(deliveryPerson);
  }

  async findMany(): Promise<DeliveryPerson[]> {
    const deliveryPeople = this.items.filter(
      (item): item is DeliveryPerson => item instanceof DeliveryPerson,
    );
    return deliveryPeople;
  }

  async findById(
    deliveryPersonId: string,
  ): Promise<DeliveryPerson | Administrator | null> {
    const deliveryPerson = this.items.find(
      (item) => item.id.toString() === deliveryPersonId,
    );

    if (!deliveryPerson) {
      return null;
    }

    return deliveryPerson;
  }

  async findByCpf(cpf: string): Promise<DeliveryPerson | Administrator | null> {
    const deliveryPerson = this.items.find(
      (deliveryPerson) => deliveryPerson.cpf === cpf,
    );

    if (!deliveryPerson) {
      return null;
    }

    return deliveryPerson;
  }

  async save(deliveryPerson: DeliveryPerson | Administrator): Promise<void> {
    const deliveryPersonIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    );

    this.items[deliveryPersonIndex] = deliveryPerson;
  }

  async delete(deliveryPerson: DeliveryPerson | Administrator): Promise<void> {
    const index = this.items.findIndex((item) => item.id === deliveryPerson.id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
