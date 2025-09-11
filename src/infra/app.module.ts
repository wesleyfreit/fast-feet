import { Module } from '@nestjs/common';
import { AppController } from './http/controllers/app.controller';
import { AppService } from './http/services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
