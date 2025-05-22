import express, { type Router } from 'express';
import { loginHandler } from './login';
import { meHandler } from './me';

export const authEndpoints: Router = express.Router({ mergeParams: true });

authEndpoints.get('/me', meHandler);

authEndpoints.post('/login', loginHandler);
