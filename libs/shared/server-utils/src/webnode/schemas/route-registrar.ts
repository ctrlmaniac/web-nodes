import { z } from 'zod';
import type { RouteRegistrar } from '../types';

export const routeRegistrarSchema = z.custom<RouteRegistrar>(
  (fn): fn is RouteRegistrar => typeof fn === 'function'
);
