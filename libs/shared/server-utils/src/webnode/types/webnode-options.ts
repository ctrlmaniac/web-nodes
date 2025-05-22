import type { z } from 'zod';
import type { webnodeOptionsSchema } from '../schemas';

export type WebNodeOptions = z.infer<typeof webnodeOptionsSchema>;
