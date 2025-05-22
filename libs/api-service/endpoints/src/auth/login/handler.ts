import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '@larapida/api-service-utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Gestisce il login di un utente verificando email e password.
 * In caso di successo, restituisce un token JWT firmato.
 *
 * - Richiede che la SECRET_KEY sia impostata nell'app.
 *
 * Ritorna { token: string }
 */
export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const logger = req.app.get('LOGGER');
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    next(new HttpError(400, 'Email e password sono richiesti'));
  }

  const SECRET_KEY = req.app.get('SECRET_KEY');
  if (!SECRET_KEY) {
    if (logger?.error) logger.error('SECRET_KEY non impostata');
    next(new HttpError(500, 'Errore interno del server'));
  }

  try {
    const user = await req.prisma.user.findUnique({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      next(new HttpError(401, 'Credenziali non valide'));
    }

    const payload = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    if (logger?.error) logger.error(error);
    next(new HttpError(500, 'Errore interno del server'));
  }
}
