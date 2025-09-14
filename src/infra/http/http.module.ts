import { AuthenticateUseCase } from '@/domain/recipient-order-delivery/application/use-cases/authenticate';
import { RegisterDeliveryPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-delivery-person';
import { RegisterRecipientPersonUseCase } from '@/domain/recipient-order-delivery/application/use-cases/register-recipient-person';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { RegisterDeliveryPersonController } from './controllers/register-delivery-person.controller';
import { RegisterRecipientPersonController } from './controllers/register-recipient-person.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    RegisterDeliveryPersonController,
    RegisterRecipientPersonController,
  ],
  providers: [
    AuthenticateUseCase,
    RegisterDeliveryPersonUseCase,
    RegisterRecipientPersonUseCase,
  ],
})
export class HttpModule {}
