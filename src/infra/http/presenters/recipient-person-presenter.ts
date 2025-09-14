import { RecipientPerson } from '@/domain/recipient-order-delivery/enterprise/entities/recipient-person';

export class RecipientPersonPresenter {
  static toHTTP(recipientPerson: RecipientPerson) {
    return {
      id: recipientPerson.id.toString(),
      name: recipientPerson.name,
      cpf: recipientPerson.cpf,
      email: recipientPerson.email,
      createdAt: recipientPerson.createdAt,
    };
  }
}
