import { envSchema } from '../schemas';

export function loadEnvOptions() {
  const env = envSchema.parse(process.env);

  return {
    port: env.PORT,
    secure: env.SECURE,
    environment: env.NODE_ENV,
    baseDomain: env.BASE_DOMAIN,
  };
}
