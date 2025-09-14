import { AuthenticateUseCase } from '@/domain/recipient-order-delivery/application/use-cases/authenticate';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController],
  providers: [AuthenticateUseCase],
})
export class HttpModule {}
