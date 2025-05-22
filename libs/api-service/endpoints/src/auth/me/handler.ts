import { HttpError } from '@larapida/api-service-utils';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Verifica e decodifica il JWT token presente nel Authorization header.
 *
 * - Richiede che la SECRET_KEY sia impostata nell'app.
 *
 * Ritorna { id: string, isAdmin: boolean }
 */
export function meHandler(req: Request, res: Response, next: NextFunction) {
  const logger = req.app.get('LOGGER');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new HttpError(401, 'Token mancante o malformato'));
  }

  const token = authHeader?.split(' ')[1];

  // Check if SECRET_KEYY is set
  const SECRET_KEY = req.app.get('SECRET_KEY');
  if (!SECRET_KEY) {
    if (logger?.error) logger.error('SECRET_KEY non impostata');
    next(new HttpError(500, 'Errore interno del server'));
  }

  try {
    const payload = jwt.verify(
      token as string,
      process.env.SECRET_KEY as string
    );

    res.json(payload);
  } catch (error) {
    if (logger?.error) logger.error(error);
    next(new HttpError(401, 'Token non valido'));
  }
}
