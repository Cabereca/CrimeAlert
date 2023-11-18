export interface IUser {
  _id: number;
  email: string;
  name: string;
  password: string;
  birthDate?: Date;
  country?: string;
  city?: string;
  adress?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
