import type { CorsOptions } from 'cors';
import type { Application } from 'express';

/**
 * Creates CORS configuration based on the app's HOSTNAME and BASE_DOMAIN.
 */
export function createCorsOptions(app: Application): CorsOptions {
  const baseDomain: string = app.get('BASE_DOMAIN');

  // Caso localhost: permette tutto
  if (baseDomain === 'localhost') {
    return {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    };
  }

  // Crea pattern per includere dominio base e tutti i sottodomini
  const baseDomainPattern = new RegExp(`\\.${baseDomain}$`);

  const allowedOrigins: (string | RegExp)[] = [
    `http://${baseDomain}`,
    `https://${baseDomain}`,
    baseDomainPattern,
  ];

  return {
    origin: (origin: string | undefined, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.some(
          (entry) => entry instanceof RegExp && entry.test(origin)
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS origin not allowed'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  };
}
