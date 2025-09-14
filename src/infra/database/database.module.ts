import { DeliveryPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/delivery-people-repository';
import { OrdersRepository } from '@/domain/recipient-order-delivery/application/repositories/orders-repository';
import { RecipientPeopleRepository } from '@/domain/recipient-order-delivery/application/repositories/recipient-people-repository';
import { Module } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaDeliveryPeopleRepository } from './prisma/repositories/prisma-delivery-people-repository';
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository';
import { PrismaRecipientPeopleRepository } from './prisma/repositories/prisma-recipient-people-repository';

@Module({
  providers: [
    PrismaService,
    EnvService,
    { provide: DeliveryPeopleRepository, useClass: PrismaDeliveryPeopleRepository },
    { provide: RecipientPeopleRepository, useClass: PrismaRecipientPeopleRepository },
    { provide: OrdersRepository, useClass: PrismaOrdersRepository },
  ],
  exports: [
    PrismaService,
    DeliveryPeopleRepository,
    RecipientPeopleRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule {}
