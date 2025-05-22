import type { Application } from 'express';
import type { Server } from 'http';
import type { ApplicationLogger } from './logger';

export interface WebNodeInternals {
  readonly app: Application;
  readonly server?: Server;
  readonly logger: ApplicationLogger;
}
