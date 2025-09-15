import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { envSchema } from './env/env-schema';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';
import { HttpModule } from './http/http.module';
import { EventModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      envFilePath:
        process.env.NODE_ENV && process.env.NODE_ENV !== 'production'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
    EventModule,
    HttpModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
