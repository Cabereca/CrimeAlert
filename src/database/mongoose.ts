import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.MONGO_DB_URL as string;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(url);
  console.log('Conectado com o Mongo');
}

export default mongoose;
