import { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './http-error';

export const httpErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = req.app.get('LOGGER');

  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    if (logger?.error) logger.error(err);
    return next(err);
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
  } else {
    // Log unexpected errors
    if (logger?.error) logger.error(err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};
