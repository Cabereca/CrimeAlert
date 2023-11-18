import { Schema } from 'mongoose';
import mongoose from '../database/mongoose';
import { IUser } from '../dtos/UserDTO';

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    adress: {
      type: String
    },
    phone: {
      type: String
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export { User, UserSchema };
