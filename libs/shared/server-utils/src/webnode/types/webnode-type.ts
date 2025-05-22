import type { WebNodeInternals } from './webnode-internals';
import type { WebNodeLifecycle } from './webnode-lyfecycle';
import type { WebNodeConfig } from './webnode-config';

export type WebNodeType = WebNodeConfig & WebNodeLifecycle & WebNodeInternals;
