import { Request, Response } from 'express';
import { User } from '../models/User';
import { NotFoundError, UnauthorizedError } from '../helpers/api-errors';
import bcrypt from 'bcrypt';
import { generateToken } from '../services/userServices';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    throw new NotFoundError('Cade o menino de papai');
  }
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    throw new UnauthorizedError('Vai timbora carniça!!');
  }
  const token = generateToken({ email });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return res.send({
    userWithoutPassword,
    token
  });
};

export { login };
