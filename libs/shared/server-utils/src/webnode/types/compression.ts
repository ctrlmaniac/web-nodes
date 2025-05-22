import { z } from 'zod';
import type { webnodeOptionsSchema } from '../schemas';

export type CompressionOption = z.infer<
  typeof webnodeOptionsSchema
>['compression'];
