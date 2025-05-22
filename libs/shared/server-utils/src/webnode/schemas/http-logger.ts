import { z } from 'zod';
import type { Options as HttpLoggerOptions } from 'pino-http';

export const pinoHttpOptionsObjectSchema = z.custom<HttpLoggerOptions>();

export const httpLoggerSchema = z.union([
  z.literal(false),
  pinoHttpOptionsObjectSchema,
]);
