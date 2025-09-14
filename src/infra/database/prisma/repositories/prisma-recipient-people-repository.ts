import { PaginationParams } from '@/core/repositories/pagination-params';
import { PaginationResult } from '@/core/repositories/pagination-result';
import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { RecipientPerson } from '@/domain/recipient-order-delivery/enterprise/entities/recipient-person';
import { Injectable } from '@nestjs/common';
import { PrismaRecipientPersonMapper } from '../mappers/prisma-recipient-person-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaRecipientPeopleRepository implements RecipientPeopleRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipientPerson: RecipientPerson): Promise<void> {
    const data = PrismaRecipientPersonMapper.toPrisma(recipientPerson);
    await this.prisma.recipient.create({ data });
  }

  async findMany(
    pagination: PaginationParams,
  ): Promise<PaginationResult<RecipientPerson, 'recipients'>> {
    const totalItems = await this.prisma.recipient.count();

    const { page, perPage } = pagination;

    const totalPages = Math.ceil(totalItems / perPage);
    const currentPage = page > totalPages ? totalPages : page;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    const recipientPeople = await this.prisma.recipient.findMany({
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
      recipients: recipientPeople.map((recipientPerson) =>
        PrismaRecipientPersonMapper.toDomain(recipientPerson),
      ),
    };
  }

  async findById(id: string): Promise<RecipientPerson | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientPersonMapper.toDomain(recipient);
  }

  async findByCpf(cpf: string): Promise<RecipientPerson | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { cpf },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientPersonMapper.toDomain(recipient);
  }

  async findByEmail(email: string): Promise<RecipientPerson | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { email },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientPersonMapper.toDomain(recipient);
  }

  async save(recipientPerson: RecipientPerson): Promise<void> {
    const data = PrismaRecipientPersonMapper.toPrisma(recipientPerson);

    await this.prisma.recipient.update({
      where: { id: recipientPerson.id.toString() },
      data,
    });
  }

  async delete(recipientPerson: RecipientPerson): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: recipientPerson.id.toString(),
      },
    });
  }
}
