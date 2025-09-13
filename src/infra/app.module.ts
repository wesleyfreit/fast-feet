import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CryptographyModule } from './cryptography/cryptography.module';
import { envSchema } from './env/env-schema';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';

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
    CryptographyModule,
  ],
  controllers: [],
  providers: [EnvService],
})
export class AppModule {}
