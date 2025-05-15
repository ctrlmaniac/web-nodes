import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { PrismaClient } from './client';

const client = new PrismaClient();

/**
 * Middleware Express per iniettare l'istanza di Prisma nel contesto della richiesta (`req`).
 *
 * Questo middleware assegna un client Prisma condiviso alla proprietà `req.prisma`, rendendolo disponibile
 * per i route handler successivi. È utile per mantenere una singola connessione per tutte le richieste.
 *
 * @example
 * // Registrazione globale del middleware
 * import express from 'express';
 * import { prisma } from './prisma';
 *
 * const app = express();
 * app.use(prisma);
 *
 * app.get('/utenti', async (req, res) => {
 *   const utenti = await req.prisma.utente.findMany();
 *   res.json(utenti);
 * });
 *
 * @note Assicurati di avere importato le dichiarazioni dei tipi dalla libreria "@larapida/api-service-types" all'interno di "tsconfig.app.json" nella proprietà include
 */
export const prisma: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.prisma = client;
  next();
};
