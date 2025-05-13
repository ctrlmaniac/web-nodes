import type { CorsOptions } from 'cors';
import type { Application } from 'express';

/**
 * Creates CORS configuration based on the app's hostname.
 */
export function createCorsOptions(app: Application): CorsOptions {
  const hostname: string = app.get('HOSTNAME');

  // Caso locale: permetti tutto
  if (hostname === 'localhost') {
    return {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    };
  }

  // Rimuove il sottodominio (es: api.example.com → example.com)
  const domainParts = hostname.split('.');
  const baseDomain = domainParts.slice(-2).join('.');
  const baseDomainPattern = new RegExp(`\\.${baseDomain.replace('.', '\\.')}$`);

  const allowedOrigins: (string | RegExp)[] = [
    `http://${baseDomain}`,
    `https://${baseDomain}`,
    baseDomainPattern, // tutti i sottodomini
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
        callback(new Error('Non permesso dalle regole CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  };
}
