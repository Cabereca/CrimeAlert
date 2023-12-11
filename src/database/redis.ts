import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});
(async () => {
  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('error', (err) => {
    console.log('Something went wrong ' + err);
  });

  await client.connect();
})();
export default client;
