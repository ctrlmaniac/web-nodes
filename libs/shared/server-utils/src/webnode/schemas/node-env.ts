import { z } from 'zod';
import { NODE_ENVS } from '../constants';

export const NodeEnvEnum = z.enum(NODE_ENVS);
