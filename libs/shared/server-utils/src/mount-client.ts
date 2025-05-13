import {
  type Application,
  Router,
  type Response,
  static as staticMiddleware,
} from 'express';
import { resolve } from 'node:path';
import { createRequestHandler } from '@react-router/express';
import type { ClientOptions } from './types.js';
import { pathToFileURL } from 'node:url';

export async function mountClient(app: Application, options: ClientOptions) {
  const { root, ssr, preMiddleware = [], spaMiddleware = [] } = options;

  const nodeName = app.get('NAME');

  // 1. Middleware pre-client
  for (const middleware of preMiddleware) {
    app.use(middleware);
  }

  if (ssr) {
    // Static asset handlers (with caching)
    app.use(
      '/assets',
      staticMiddleware(resolve(root, nodeName, 'client/assets'), {
        immutable: true,
        maxAge: '1y',
      })
    );
    app.use(
      '/static',
      staticMiddleware(resolve(root, nodeName, 'client/static'), {
        immutable: true,
        maxAge: '1y',
      })
    );
    app.use(
      staticMiddleware(resolve(root, nodeName, 'client'), { maxAge: '1h' })
    );

    // Server-side rendering
    const build = await import(
      pathToFileURL(resolve(root, nodeName, 'server/index.js')).toString()
    );

    app.all(
      '/*',
      createRequestHandler({
        mode: 'production',
        build,
      })
    );
  } else {
    // SPA router
    const router = Router();

    router.use(
      '/assets',
      staticMiddleware(resolve(root, nodeName, 'client/assets'))
    );
    router.use(
      '/static',
      staticMiddleware(resolve(root, nodeName, 'client/static'))
    );
    router.use(
      staticMiddleware(resolve(root, nodeName, 'client'), { maxAge: '1h' })
    );

    // Middleware SPA custom prima di index.html
    for (const handler of spaMiddleware) {
      router.use(handler);
    }

    router.all('/*', (_req, res: Response) => {
      res.sendFile(resolve(root, nodeName, 'client/index.html'));
    });

    app.use(router);
  }
}
