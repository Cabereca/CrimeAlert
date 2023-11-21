import { NextFunction, Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

type jwtDTO = { email: string };

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthorizedError('Não autorizado');
  }
  const [, token] = authorization.split(' ');
  const { email } = jwt.verify(token, process.env.JWT_SECRET || '') as jwtDTO;
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    throw new NotFoundError('User not Found');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  next();
};
