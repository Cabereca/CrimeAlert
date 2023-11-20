import { Request, Response } from 'express';
import {
  createUser,
  deleteUser,
  findUser,
  updateUser
} from '../services/userServices';

const show = async (req: Request, res: Response) => {
  const { email } = req.params;
  const user = await findUser(email);
  return res.send(user);
};

const create = async (req: Request, res: Response) => {
  const user = req.body;
  const createdUser = await createUser(user);
  return res.status(201).send(createdUser);
};

const update = async (req: Request, res: Response) => {
  const { email } = req.params;
  const userData = req.body;
  const updatedUser = await updateUser(email, userData);
  return res.send(updatedUser);
};

const destroy = async (req: Request, res: Response) => {
  const { email } = req.params;
  await deleteUser(email);
  return res.status(204).send();
};

export const UserController = {
  show,
  create,
  update,
  destroy
};
