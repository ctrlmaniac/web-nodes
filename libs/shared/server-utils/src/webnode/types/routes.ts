import type { Application } from 'express';

export type RouteRegistrar = (app: Application) => void;
