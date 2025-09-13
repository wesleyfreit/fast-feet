import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { DeliveryPeopleRepository } from '@/domain/delivery/application/repositories/delivery-people-repository';
import { Administrator } from '@/domain/delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';

export class InMemoryDeliveryPeopleRepository implements DeliveryPeopleRepository {
  public items: (DeliveryPerson | Administrator)[] = [];

  async create(deliveryPerson: DeliveryPerson): Promise<void> {
    this.items.push(deliveryPerson);
  }

  async findMany(
    pagination: PaginationParams,
    filter?: { isAdmin?: boolean },
  ): Promise<PaginationResult<DeliveryPerson | Administrator, 'deliveryPeople'>> {
    const { page, perPage } = pagination;

    const deliveryPeople = this.items
      .filter((deliveryPerson) =>
        filter?.isAdmin
          ? deliveryPerson instanceof Administrator
          : deliveryPerson instanceof DeliveryPerson,
      )
      .slice((page - 1) * perPage, page * perPage);

    const totalItems = deliveryPeople.length;

    const totalPages = Math.ceil(totalItems / perPage);
    const currentPage = page > totalPages ? totalPages : page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      prev: prevPage,
      current: currentPage,
      next: nextPage,
      pages: totalPages,
      perPage: perPage,
      items: totalItems,
      deliveryPeople: deliveryPeople,
    };
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
