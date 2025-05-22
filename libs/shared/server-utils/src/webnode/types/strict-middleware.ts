import type { Request, Response, NextFunction } from 'express';

export type StrictMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
