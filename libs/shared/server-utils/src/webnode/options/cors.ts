import type { CorsOptions } from 'cors';
import type { WebNode } from '../webnode-old';

export function createCorsOptions(node: WebNode): CorsOptions {
  const domainName = node.options.baseDomain;

  if (!domainName) {
    throw new Error(
      'the baseDomain option is required for CORS configuration. Either set it in the WebNode constructor or in the environment variable BASE_DOMAIN'
    );
  }

  const domainParts = domainName.split('.');
  const baseDomainPattern = `.${domainParts.slice(-2).join('\\.')}$`;

  const allowedOrigins: (string | RegExp)[] = [
    `http://${domainName}`,
    `https://${domainName}`,
    new RegExp(baseDomainPattern),
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
