import { z } from 'zod';
import { baseDomainRegExp } from '../constants';
import { NodeEnvEnum } from './node-env';

export const envSchema = z.object({
  BASE_DOMAIN: z.string().regex(baseDomainRegExp, 'BASE_DOMAIN is not valid'),

  PORT: z
    .string()
    .transform((v) => (v ? Number.parseInt(v) : undefined))
    .refine((val) => val && !isNaN(val) && val >= 1 && val <= 65535)
    .optional(),

  SECURE: z
    .union([z.literal('true'), z.literal('false')])
    .transform((val) => val === 'true')
    .optional(),

  NODE_ENV: NodeEnvEnum.optional(),
});
