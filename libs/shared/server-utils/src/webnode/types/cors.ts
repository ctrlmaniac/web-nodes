import { z } from 'zod';
import type { webnodeOptionsSchema } from '../schemas';

export type CorsOption = z.infer<typeof webnodeOptionsSchema>['cors'];
