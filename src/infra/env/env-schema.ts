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
});

export type Env = z.infer<typeof envSchema>;
