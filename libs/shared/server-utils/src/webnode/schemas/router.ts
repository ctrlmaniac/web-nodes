import type { Router } from 'express';
import { z } from 'zod';

export const bareRouterSchema = z.custom<Router>();
export const routerLoaderSchema = z.function().returns(z.custom<Router>());
export const routerEntrySchema = z.union([
  bareRouterSchema,
  routerLoaderSchema,
]);
export const routerWithPathSchema = z.object({
  path: z.string().startsWith('/'),
  router: routerEntrySchema,
});

export const routerSchema = z.union([routerEntrySchema, routerWithPathSchema]);
