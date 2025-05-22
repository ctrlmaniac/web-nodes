import type { WebNode } from '../webnode-old';

export async function stopServer(node: WebNode): Promise<void> {
  if (!node.server) return;

  return new Promise((resolve, reject) => {
    node.server?.close((err) => {
      if (err) reject(err);
      else {
        node.logger?.info('Server stopped');
        resolve();
      }
    });
  });
}
