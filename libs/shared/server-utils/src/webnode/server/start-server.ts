import type { WebNode } from '../webnode-old';
import http from 'http';

export async function startServer(node: WebNode): Promise<http.Server> {
  const app = node.app;
  const port = node.options.port;

  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      node.logger?.info(`Server started on port ${port}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}
