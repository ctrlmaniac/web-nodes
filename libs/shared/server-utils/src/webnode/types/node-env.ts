import { z } from 'zod';
import type { NodeEnvEnum } from '../schemas';

export type NodeEnv = z.infer<typeof NodeEnvEnum>;
