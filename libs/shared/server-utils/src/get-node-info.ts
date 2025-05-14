import type { Application } from 'express';

interface NodeInfoExtended {
  ENVIRONMENT: string;
  NAME: string;
  BASE_DOMAIN: string;
  SECURE: boolean;
  PORT: number;
  HOSTNAME?: string;
}

export function getNodeInfo(app: Application): NodeInfoExtended {
  return {
    ENVIRONMENT: app.get('ENVIRONMENT'),
    NAME: app.get('NAME'),
    BASE_DOMAIN: app.get('BASE_DOMAIN'),
    SECURE: app.get('SECURE'),
    PORT: app.get('PORT'),
    HOSTNAME: app.get('HOSTNAME'),
  };
}
