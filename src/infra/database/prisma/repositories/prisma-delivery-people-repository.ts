import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import {
  DeliveryPeopleRepository,
  DeliveryPersonFilterParams,
} from '@/domain/recipient-order-delivery/application/repositories/delivery-people-repository';
import { Administrator } from '@/domain/recipient-order-delivery/enterprise/entities/administrator';
import { DeliveryPerson } from '@/domain/recipient-order-delivery/enterprise/entities/delivery-person';
import { Injectable } from '@nestjs/common';
import { PrismaDeliveryPersonMapper } from '../mappers/prisma-delivery-person-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaDeliveryPeopleRepository implements DeliveryPeopleRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryPerson: DeliveryPerson): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryPerson);
    await this.prisma.user.create({ data });
  }

  async findMany(
    pagination: PaginationParams,
    filter?: DeliveryPersonFilterParams,
  ): Promise<PaginationResult<DeliveryPerson | Administrator, 'deliveryPeople'>> {
    const deliveryPersonWhereInput = PrismaDeliveryPersonMapper.toWhereInput(filter);

    const totalItems = await this.prisma.user.count({
      where: deliveryPersonWhereInput,
    });

    const { page, perPage } = pagination;

    const totalPages = Math.ceil(totalItems / perPage);
    const currentPage = page > totalPages ? totalPages : page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const deliveryPeople = await this.prisma.user.findMany({
      where: deliveryPersonWhereInput,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      prev: prevPage,
      current: currentPage,
      next: nextPage,
      pages: totalPages,
      perPage: perPage,
      items: totalItems,
      deliveryPeople: deliveryPeople.map((deliveryPerson) =>
        PrismaDeliveryPersonMapper.toDomain(deliveryPerson),
      ),
    };
  }

  async findById(id: string): Promise<DeliveryPerson | Administrator | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return PrismaDeliveryPersonMapper.toDomain(user);
  }

  async findByCpf(cpf: string): Promise<DeliveryPerson | Administrator | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!user) {
      return null;
    }

    return PrismaDeliveryPersonMapper.toDomain(user);
  }

  async save(deliveryPerson: DeliveryPerson | Administrator): Promise<void> {
    const data = PrismaDeliveryPersonMapper.toPrisma(deliveryPerson);

    await this.prisma.user.update({
      where: { id: deliveryPerson.id.toString() },
      data,
    });
  }

  async delete(deliveryPerson: DeliveryPerson | Administrator): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryPerson.id.toString(),
      },
    });
  }
}
