import { AuthenticateUseCase } from '@/domain/recipient-order-delivery/application/use-cases/authenticate';
import { CreateOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/create-order';
import { DeleteDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-delivery-person';
import { DeleteRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-recipient-person';
import { FetchDeliveryPeopleUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-delivery-people';
import { FetchRecipientPeopleUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-recipient-people';
import { RegisterDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-delivery-person';
import { RegisterRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-recipient-person';
import { UpdateDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-delivery-person';
import { UpdateRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-recipient-person';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateOrderController } from './controllers/create-order.controller';
import { DeleteDeliveryPersonController } from './controllers/delete-delivery-person.controller';
import { DeleteRecipientPersonController } from './controllers/delete-recipient-person.controller';
import { FetchDeliveryPeopleController } from './controllers/fetch-delivery-people.controller';
import { FetchRecipientPeopleController } from './controllers/fetch-recipient-people.controller';
import { RegisterDeliveryPersonController } from './controllers/register-delivery-person.controller';
import { RegisterRecipientPersonController } from './controllers/register-recipient-person.controller';
import { UpdateDeliveryPersonController } from './controllers/update-delivery-person.controller';
import { UpdateRecipientPersonController } from './controllers/update-recipient-person.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateOrderController,
    FetchDeliveryPeopleController,
    FetchRecipientPeopleController,
    DeleteDeliveryPersonController,
    DeleteRecipientPersonController,
    RegisterDeliveryPersonController,
    RegisterRecipientPersonController,
    UpdateDeliveryPersonController,
    UpdateRecipientPersonController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateOrderUseCase,
    FetchDeliveryPeopleUseCase,
    FetchRecipientPeopleUseCase,
    DeleteDeliveryPersonUseCase,
    DeleteRecipientPersonUseCase,
    RegisterDeliveryPersonUseCase,
    RegisterRecipientPersonUseCase,
    UpdateDeliveryPersonUseCase,
    UpdateRecipientPersonUseCase,
  ],
})
export class HttpModule {}
