import type { Application } from 'express';
import type { NodeInfo } from './types.js';

type NodeInfoOverrides = {
  [K in keyof NodeInfo as Uppercase<string & K>]: NodeInfo[K];
};

export function getNodeInfo(app: Application): NodeInfoOverrides {
  return {
    ENVIRONMENT: app.get('ENVIRONMENT'),
    NAME: app.get('NAME'),
    HOSTNAME: app.get('HOSTNAME'),
    SECURE: app.get('SECURE'),
    PORT: app.get('PORT'),
  };
}
