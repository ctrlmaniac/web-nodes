import { Server } from 'http';
import type { WebNodeType } from '../types';

export class HttpServerService {
  /**
   * Starts the HTTP server for a given web node.
   * It listens on the specified port (defaulting to 3000) and
   * returns a Promise that resolves when the server starts listening.
   * @param webnode - The web node containing the Express app and options.
   * @returns A Promise that resolves with the HTTP Server instance.
   */
  async start(webnode: WebNodeType): Promise<Server> {
    const { app, options } = webnode;
    const port = options.port;
    const server = app.listen(port);
    return new Promise((resolve) =>
      server.once('listening', () => resolve(server))
    );
  }

  /**
   * Stops the HTTP server associated with a given web node.
   * It checks if a server instance exists on the web node before attempting to close it.
   * Returns a Promise that resolves when the server is successfully closed, or rejects if an error occurs.
   * @param webnode - The web node containing the HTTP Server instance.
   * @returns A Promise that resolves when the server is stopped.
   */
  async stop(webnode: WebNodeType): Promise<void> {
    if (webnode.server) {
      const serverInstance = webnode.server;

      await new Promise((resolve, reject) => {
        serverInstance.close((err) => (err ? reject(err) : resolve(undefined)));
      });
    }
  }
}
