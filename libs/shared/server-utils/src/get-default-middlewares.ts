import compression from 'compression';
import cors from 'cors';
import express, { type Application, type RequestHandler } from 'express';
import morgan from 'morgan';
import { createCorsOptions } from './create-cors-options';

/**
 * Restituisce un array di middleware Express comuni usati in tutte le app.
 * Puoi filtrare/disattivare alcuni middleware via opzioni in futuro.
 */
export function getDefaultMiddleware(app: Application): RequestHandler[] {
  const logger = app.get('LOGGER');

  return [
    compression(),
    cors(createCorsOptions(app)),
    express.json(),
    express.urlencoded({ extended: true }),
    morgan('dev', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }),
  ];
}
