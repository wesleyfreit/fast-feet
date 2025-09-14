import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(8080),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SENDER_HOST: z.string(),
  SENDER_PORT: z.coerce.number(),
  SENDER_USER: z.string(),
  SENDER_PASS: z.string(),
  SENDER_FROM: z.string(),
  BUCKET_ENDPOINT: z.string(),
  BUCKET_NAME: z.string(),
  BUCKET_REGION: z.string().default('us-east-1'),
  BUCKET_ACCESS_KEY_ID: z.string(),
  BUCKET_SECRET_ACCESS_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
