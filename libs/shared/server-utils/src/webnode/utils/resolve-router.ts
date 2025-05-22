import type { Router } from 'express';
import type { RouterLoader, RouterValue } from '../types';

/**
 * Resolves a router value, which may be a direct Router or a RouterLoader.
 * Ensures safe invocation and avoids middleware inference errors.
 */
export function resolveRouter(router: RouterValue): Router {
  if (typeof router === 'function') {
    const loaded = (router as RouterLoader)(); // force type narrowing
    if (!loaded) {
      throw new Error(
        'RouterLoader returned undefined. Ensure it returns a valid Express router.'
      );
    }
    return loaded;
  }
  return router;
}
