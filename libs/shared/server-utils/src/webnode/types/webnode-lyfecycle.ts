export interface WebNodeLifecycle {
  /**
   * Configures the WebNode instance (middleware, routes, routers, etc).
   */
  bootstrap(): Promise<void>;

  /**
   * Starts the HTTP server after bootstrapping.
   */
  serve(): Promise<void>;

  /**
   * Stops the HTTP server gracefully.
   */
  stop(): Promise<void>;
}
