import type { Router } from 'express';

export type RouterLoader = () => Router | Promise<Router>;
export type RouterValue = Router | RouterLoader;
export type RouterEntry = { path: string; router: RouterValue };
export type RouterDefinition = RouterValue | RouterEntry;
