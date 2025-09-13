import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { RecipientPerson } from '@/domain/recipient-order-delivery/enterprise/entities/recipient-person';

export class InMemoryRecipientPeopleRepository implements RecipientPeopleRepository {
  public items: RecipientPerson[] = [];

  async create(recipientPerson: RecipientPerson): Promise<void> {
    this.items.push(recipientPerson);
  }

  async findMany(
    pagination: PaginationParams,
  ): Promise<PaginationResult<RecipientPerson, 'recipientPeople'>> {
    const { page, perPage } = pagination;

    const recipientPeople = this.items.slice((page - 1) * perPage, page * perPage);

    const totalItems = this.items.length;

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
      recipientPeople: recipientPeople,
    };
  }

  async findById(recipientPersonId: string): Promise<RecipientPerson | null> {
    const recipientPerson = this.items.find(
      (item) => item.id.toString() === recipientPersonId,
    );

    if (!recipientPerson) {
      return null;
    }

    return recipientPerson;
  }

  async findByCpf(cpf: string): Promise<RecipientPerson | null> {
    const recipientPerson = this.items.find(
      (recipientPerson) => recipientPerson.cpf === cpf,
    );

    if (!recipientPerson) {
      return null;
    }

    return recipientPerson;
  }

  async findByEmail(email: string): Promise<RecipientPerson | null> {
    const recipientPerson = this.items.find(
      (recipientPerson) => recipientPerson.email === email,
    );

    if (!recipientPerson) {
      return null;
    }

    return recipientPerson;
  }

  async save(recipientPerson: RecipientPerson): Promise<void> {
    const recipientPersonIndex = this.items.findIndex(
      (item) => item.id === recipientPerson.id,
    );

    this.items[recipientPersonIndex] = recipientPerson;
  }

  async delete(recipientPerson: RecipientPerson): Promise<void> {
    const index = this.items.findIndex((item) => item.id === recipientPerson.id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
