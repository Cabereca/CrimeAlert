import { Request, Response } from 'express';
import { User } from '../models/User';
import { NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/userServices';
import client from '../database/redis';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user;
  let cache = await client.get(email);
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
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    throw new UnauthorizedError('Usuário ou senha incorretos');
  }
  const token = generateToken({ email });
  const { password: _, ...userWithoutPassword } = cache
    ? user
    : user.toObject();

  return res.send({
    userWithoutPassword,
    token
  });
};

export { login };
