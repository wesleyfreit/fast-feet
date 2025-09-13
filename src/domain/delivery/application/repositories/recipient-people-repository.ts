import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { RecipientPerson } from '../../enterprise/entities/recipient-person';

export abstract class RecipientPeopleRepository {
  abstract create(recipientPerson: RecipientPerson): Promise<void>;
  abstract findMany(
    pagination: PaginationParams,
  ): Promise<PaginationResult<RecipientPerson, 'recipientPeople'>>;
  abstract findById(id: string): Promise<RecipientPerson | null>;
  abstract findByCpf(cpf: string): Promise<RecipientPerson | null>;
  abstract findByEmail(email: string): Promise<RecipientPerson | null>;
  abstract save(recipientPerson: RecipientPerson): Promise<void>;
  abstract delete(recipientPerson: RecipientPerson): Promise<void>;
}
