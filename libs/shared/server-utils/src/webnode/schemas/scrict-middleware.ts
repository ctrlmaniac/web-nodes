import { z } from 'zod';
import type { StrictMiddleware } from '../types';

export const strictMiddlewareSchema = z.custom<StrictMiddleware>(
  (fn): fn is StrictMiddleware => typeof fn === 'function'
);
