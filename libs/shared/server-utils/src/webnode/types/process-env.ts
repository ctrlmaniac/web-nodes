import type { z } from 'zod';
import type { envSchema } from '../schemas';

export type ProcessEnv = z.infer<typeof envSchema>;
