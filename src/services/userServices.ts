import { User } from '../models/User';
import { IUser } from '../dtos/UserDTO';
import { BadRequestError, InternalServerError } from '../helpers/api-errors';
import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';

type TokenType = { email: string };

const hashPassword = async (password: string) => {
  return await hash(password, 10);
};

const generateToken = ({ email }: TokenType) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET || '', {
    expiresIn: '8h'
  });
  return token;
};

const findUser = async (email: string) => {
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    throw new BadRequestError('User Not Found');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const createUser = async (user: IUser) => {
  const userExists = await findUser(user.email);
  if (userExists) {
    throw new BadRequestError('User already exists');
  }
  const createdUser = await User.create({
    email: user.email,
    name: user.name,
    password: await hashPassword(user.password),
    birthDate: user.birthDate,
    country: user.country,
    city: user.city,
    adress: user.adress,
    phone: user.phone
  });
  if (!createdUser) {
    throw new InternalServerError('Error creating user');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = createdUser;
  const token = generateToken({ email: user.email });
  return { user: { ...userWithoutPassword }, token };
};

const updateUser = async (email: string, userData: Partial<IUser>) => {
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    throw new BadRequestError('User not exists');
  }
  const updatedUser = await user.updateOne(userData);
  if (!updatedUser) {
    throw new InternalServerError('Error updating user');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword;
};

const deleteUser = async (email: string) => {
  await User.findOneAndDelete({ email });
  return;
};

export { findUser, createUser, updateUser, deleteUser, generateToken };
