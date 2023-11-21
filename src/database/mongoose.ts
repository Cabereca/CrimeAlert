import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_ATLAS_URL as string;

const connect = async function () {
  await mongoose
    .connect(url)
    .then(() => console.log('Conectado com o Mongo'))
    .catch((err) => console.log(err));
};

connect();
export default mongoose;
