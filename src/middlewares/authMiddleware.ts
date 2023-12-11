import { NextFunction, Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import client from '../database/redis';

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

  let user;
  const cache = await client.get(email);
  if (cache) {
    console.log('cache');

    user = JSON.parse(cache);
  } else {
    console.log('db');
    user = await User.findOne({
      email
    });
    if (!user) {
      throw new NotFoundError('User not Found');
    }
    await client.set(email, JSON.stringify(user.toObject()));
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = cache ? user : user.toObject();
  req.user = userWithoutPassword;
  next();
};
