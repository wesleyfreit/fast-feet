import { AuthenticateUseCase } from '@/domain/recipient-order-delivery/application/use-cases/authenticate';
import { DeleteDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-delivery-person';
import { DeleteRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/delete-recipient-person';
import { RegisterDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-delivery-person';
import { RegisterRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-recipient-person';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { DeleteDeliveryPersonController } from './controllers/delete-delivery-person.controller';
import { DeleteRecipientPersonController } from './controllers/delete-recipient-person.controller';
import { RegisterDeliveryPersonController } from './controllers/register-delivery-person.controller';
import { RegisterRecipientPersonController } from './controllers/register-recipient-person.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    DeleteDeliveryPersonController,
    DeleteRecipientPersonController,
    RegisterDeliveryPersonController,
    RegisterRecipientPersonController,
  ],
  providers: [
    AuthenticateUseCase,
    DeleteDeliveryPersonUseCase,
    DeleteRecipientPersonUseCase,
    RegisterDeliveryPersonUseCase,
    RegisterRecipientPersonUseCase,
  ],
})
export class HttpModule {}
