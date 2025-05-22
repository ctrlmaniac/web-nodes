import { z } from 'zod';
import type { LoggerOptions } from 'pino';
import { webnodeIdRegExp, baseDomainRegExp } from '../constants';
import { NodeEnvEnum } from './node-env';
import { strictMiddlewareSchema } from './scrict-middleware';
import { routeRegistrarSchema } from './route-registrar';
import { routerSchema } from './router';
import { httpLoggerSchema } from './http-logger';
import type { CorsOptions } from 'cors';
import type { CompressionOptions } from 'compression';

export const webnodeOptionsSchema = z.object({
  id: z.union([
    z.literal('main'),
    z.string().regex(webnodeIdRegExp, {
      message: 'Invalid WebNode id format',
    }),
  ]),

  port: z.number().int().nonnegative().min(3000).max(65535).optional(),

  secure: z.boolean().optional(),

  environment: NodeEnvEnum.optional(),

  baseDomain: z
    .union([
      z.literal('localhost'),
      z.string().regex(baseDomainRegExp, {
        message: 'Invalid base domain (no subdomain, no protocol)',
      }),
    ])
    .optional(),

  logger: z
    .union([
      z.literal(false),
      z
        .record(NodeEnvEnum, z.custom<LoggerOptions>())
        .refine((obj) => Object.keys(obj).length > 0, {
          message:
            'At least one environment-specific logger option must be defined.',
        }),
    ])
    .optional(),

  compression: z
    .union([z.literal(false), z.custom<CompressionOptions>()])
    .optional(),

  cors: z.union([z.literal(false), z.custom<CorsOptions>()]).optional(),

  bodyParser: z
    .union([
      z.literal(false),
      z.object({
        jsonLimit: z.string().optional(),
        urlEncodedLimit: z.string().optional(),
        extended: z.boolean().optional(),
      }),
    ])
    .optional(),

  httpLogger: httpLoggerSchema.optional(),

  middlewares: z.array(strictMiddlewareSchema).min(1).optional(),

  routes: routeRegistrarSchema.optional(),

  routers: z.array(routerSchema).min(1).optional(),
});
