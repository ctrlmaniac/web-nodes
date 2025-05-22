import type { RouterDefinition, RouterEntry } from '../types';

export function isRouterEntry(entry: RouterDefinition): entry is RouterEntry {
  return typeof entry === 'object' && 'path' in entry && 'router' in entry;
}
