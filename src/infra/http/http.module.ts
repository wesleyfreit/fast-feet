import { GetPresignedUploadUrlUseCase } from '@/domain/media/application/use-cases/get-presigned-upload-url';
import { AuthenticateUseCase } from '@/domain/recipient-order-delivery/application/use-cases/authenticate';
import { CreateOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/create-order';
import { DeleteDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-delivery-person';
import { DeleteOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-order';
import { DeleteRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-recipient-person';
import { FetchDeliveryPeopleUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-delivery-people';
import { FetchDeliveryPersonOrdersUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-delivery-person-orders';
import { FetchOrdersUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-orders';
import { FetchRecipientPeopleUseCase } from '@/domain/recipient-order-delivery/application/use-cases/fetch-recipient-people';
import { GrantAdministratorAccessUseCase } from '@/domain/recipient-order-delivery/application/use-cases/grant-administrator-access';
import { RegisterDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-delivery-person';
import { RegisterRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-recipient-person';
import { ResetDeliveryPersonPasswordUseCase } from '@/domain/recipient-order-delivery/application/use-cases/reset-delivery-person-password';
import { UpdateDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-delivery-person';
import { UpdateRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/update-recipient-person';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateOrderController } from './controllers/create-order.controller';
import { DeleteDeliveryPersonController } from './controllers/delete-delivery-person.controller';
import { DeleteOrderController } from './controllers/delete-order.controller';
import { DeleteRecipientPersonController } from './controllers/delete-recipient-person.controller';
import { FetchDeliveryPeopleController } from './controllers/fetch-delivery-people.controller';
import { FetchDeliveryPersonOrdersController } from './controllers/fetch-delivery-person-orders.controller';
import { FetchOrdersController } from './controllers/fetch-orders.controller';
import { FetchRecipientPeopleController } from './controllers/fetch-recipient-people.controller';
import { GetPresignedUploadUrlController } from './controllers/get-presigned-upload-url.controller';
import { GrantAdministratorAccessController } from './controllers/grant-administrator-access.controller';
import { RegisterDeliveryPersonController } from './controllers/register-delivery-person.controller';
import { RegisterRecipientPersonController } from './controllers/register-recipient-person.controller';
import { ResetDeliveryPersonPasswordController } from './controllers/reset-delivery-person-password.controller';
import { UpdateDeliveryPersonController } from './controllers/update-delivery-person.controller';
import { UpdateRecipientPersonController } from './controllers/update-recipient-person.controller';
import { PickUpOrderController } from './controllers/pick-up-order.controller';
import { DeliverOrderController } from './controllers/deliver-order.controller';
import { DeliverOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/deliver-order';
import { ReturnOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/return-order';
import { ReturnOrderController } from './controllers/return-roder.controller';
import { PickUpOrderUseCase } from '@/domain/recipient-order-delivery/application/use-cases/pick-up-order';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateController,
    CreateOrderController,
    FetchDeliveryPeopleController,
    FetchDeliveryPersonOrdersController,
    FetchRecipientPeopleController,
    FetchOrdersController,
    DeleteDeliveryPersonController,
    DeleteOrderController,
    DeleteRecipientPersonController,
    DeliverOrderController,
    GetPresignedUploadUrlController,
    GrantAdministratorAccessController,
    PickUpOrderController,
    RegisterDeliveryPersonController,
    RegisterRecipientPersonController,
    ResetDeliveryPersonPasswordController,
    ReturnOrderController,
    UpdateDeliveryPersonController,
    UpdateRecipientPersonController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateOrderUseCase,
    FetchDeliveryPeopleUseCase,
    FetchDeliveryPersonOrdersUseCase,
    FetchRecipientPeopleUseCase,
    FetchOrdersUseCase,
    DeleteDeliveryPersonUseCase,
    DeleteOrderUseCase,
    DeleteRecipientPersonUseCase,
    DeliverOrderUseCase,
    GetPresignedUploadUrlUseCase,
    GrantAdministratorAccessUseCase,
    PickUpOrderUseCase,
    RegisterDeliveryPersonUseCase,
    RegisterRecipientPersonUseCase,
    ResetDeliveryPersonPasswordUseCase,
    ReturnOrderUseCase,
    UpdateDeliveryPersonUseCase,
    UpdateRecipientPersonUseCase,
  ],
})
export class HttpModule {}
