import type { RequestHandler } from 'express';

/**
 * Options for configuring the client-side application.
 */
export interface ClientOptions {
  /**
   * Enables Server-Side Rendering (SSR).
   * @default false
   */
  ssr?: boolean;

  /**
   * The absolute path to the root directory of the client-side application.
   */
  root: string;

  /**
   * The name of this specific node instance.
   */
  nodeName: string;

  /**
   * An optional array of Express RequestHandler functions to be executed before the main application middleware.
   */
  preMiddleware?: RequestHandler[];

  /**
   * An optional array of Express RequestHandler functions to handle Single-Page Application (SPA) routing.
   */
  spaMiddleware?: RequestHandler[];
}

/**
 * Represents the possible environments in which the node application can run.
 * @typedef {'development' | 'production'} NodeEnvironment
 */
export type NodeEnvironment = 'development' | 'production';

/**
 * Information about the application node.
 */
export interface NodeInfo {
  /**
   * The environment where the node is deployed.
   * @default 'development'
   */
  environment?: NodeEnvironment;

  /**
   * The name of the node.
   */
  name: string;

  /**
   * The public URL or hostname of the node.
   * @default "localhost"
   */
  hostname?: string;

  /**
   * Indicates whether the node should be served over HTTPS.
   * This option might influence the behavior of other middleware.
   * @default false
   */
  secure?: boolean;

  /**
   * The port on which the node will listen for incoming requests.
   * @default 3000
   */
  port?: number;
}

/**
 * Options for creating the application, including both client and node-specific configurations.
 */
export interface CreateAppOptions extends NodeInfo {
  /**
   * Optional configuration for the client-side application.
   */
  client?: ClientOptions;
}
