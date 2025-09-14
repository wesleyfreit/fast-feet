import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { Administrator } from '../../enterprise/entities/administrator';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';

export type DeliveryPersonFilterParams = {
  isAdmin?: boolean;
};

export abstract class DeliveryPeopleRepository {
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>;
  abstract findMany(
    pagination: PaginationParams,
    filter?: DeliveryPersonFilterParams,
  ): Promise<PaginationResult<DeliveryPerson | Administrator, 'users'>>;
  abstract findById(id: string): Promise<DeliveryPerson | Administrator | null>;
  abstract findByCpf(cpf: string): Promise<DeliveryPerson | Administrator | null>;
  abstract save(deliveryPerson: DeliveryPerson | Administrator): Promise<void>;
  abstract delete(deliveryPerson: DeliveryPerson | Administrator): Promise<void>;
}
