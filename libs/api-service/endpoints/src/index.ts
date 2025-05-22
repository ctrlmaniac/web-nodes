import express, { type Router } from 'express';
import { authEndpoints } from './auth';

export const endpoints: Router = express.Router({ mergeParams: true });

endpoints.use('/auth', authEndpoints);
