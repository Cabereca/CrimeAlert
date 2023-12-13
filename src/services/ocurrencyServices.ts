import client from '../database/redis';
import { IOcurrency } from '../dtos/OcurrencyDTO';
import { BadRequestError, NotFoundError } from '../helpers/api-errors';
import { Ocurrency } from '../models/Ocurrency';
import { User } from '../models/User';

const getPublicOccurrecies = async () => {
  const key = `public`;
  const cachedOcurrency = await client.lRange(key, 0, -1)
  if (cachedOcurrency) {
    cachedOcurrency.map((ocurrency) => {
      return JSON.parse(ocurrency);
    });
  }
  const ocurrency = await Ocurrency.find({
    public: true
  });
  await client.rPush(key, JSON.stringify(ocurrency));
  return ocurrency.map((ocurrency) => {
    return ocurrency.toObject();
  });
};

const getUserOccurrecies = async (userId: string) => {
  if (!userId) {
    throw new BadRequestError('User id is required');
  }
  const key = `user:${userId}`;
  const cachedOcurrency = await client.lRange(key, 0, -1)
  if (cachedOcurrency) {
    cachedOcurrency.map((ocurrency) => {
      return JSON.parse(ocurrency);
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  const ocurrencies = await Ocurrency.find({
    userId: userId
  });
  await client.rPush(key, JSON.stringify(ocurrencies));
  return ocurrencies.map((ocurrency) => {
    return ocurrency.toObject();
  });
};

const createOcurrency = async (ocurrencyData: IOcurrency) => {
  const newOcurrency = await Ocurrency.create({
    userId: ocurrencyData.userId,
    title: ocurrencyData.title,
    type: ocurrencyData.type,
    date: ocurrencyData.date,
    time: ocurrencyData.time,
    location: {
      type: 'Point',
      coordinates: [
        ocurrencyData.location.coordinates[0],
        ocurrencyData.location.coordinates[1]
      ]
    },
    public: ocurrencyData.public
  });
  if (!newOcurrency) {
    throw new BadRequestError('Ocurrency not created');
  }
  if (ocurrencyData.public) {
    await client.rPush('public', JSON.stringify(newOcurrency.toObject()));
  }
  await client.rPush(`user:${ocurrencyData.userId}`, JSON.stringify(newOcurrency.toObject()));
  return newOcurrency.toObject();
};

const updateOcurrency = async (id: string, newData: Partial<IOcurrency>) => {
  if (!id) {
    throw new BadRequestError('Ocurrency id is required');
  }
  const ocurrency = await Ocurrency.findById(id);
  if (!ocurrency) {
    throw new NotFoundError('Ocurrency not found');
  }
  const updatedOcurrency = await Ocurrency.findByIdAndUpdate(id, newData, { new: true });
  if (!updatedOcurrency) {
    throw new BadRequestError('Ocurrency not updated');
  }
  if (updatedOcurrency.public && ocurrency.public) {
    await client.lRem('public', 0, JSON.stringify(ocurrency.toObject()));
    await client.lRem(`user:${ocurrency.userId}`, 0, JSON.stringify(ocurrency.toObject()));
    await client.rPush('public', JSON.stringify(updatedOcurrency.toObject()));
    await client.rPush(`user:${ocurrency.userId}`, JSON.stringify(updatedOcurrency.toObject()));
  } else if (updatedOcurrency.public && !ocurrency.public) {
    await client.lRem(`user:${ocurrency.userId}`, 0, JSON.stringify(ocurrency.toObject()));
    await client.rPush(`user:${ocurrency.userId}`, JSON.stringify(updatedOcurrency.toObject()));
    await client.rPush('public', JSON.stringify(updatedOcurrency.toObject()));
  } else if (!updatedOcurrency.public && ocurrency.public) {
    await client.lRem('public', 0, JSON.stringify(ocurrency.toObject()));
    await client.lRem(`user:${ocurrency.userId}`, 0, JSON.stringify(ocurrency.toObject()));
    await client.rPush(`user:${ocurrency.userId}`, JSON.stringify(updatedOcurrency.toObject()));
  } else {
    await client.lRem(`user:${ocurrency.userId}`, 0, JSON.stringify(ocurrency.toObject()));
    await client.rPush(`user:${ocurrency.userId}`, JSON.stringify(updatedOcurrency.toObject()));
  }
  return updatedOcurrency.toObject();
};

const deleteOcurrency = async (id: string) => {
  if (!id) {
    throw new BadRequestError('Ocurrency id is required');
  }
  const ocurrency = await Ocurrency.findById(id);
  if (!ocurrency) {
    throw new NotFoundError('Ocurrency not found');
  }
  const deletedOcurrency = await ocurrency.deleteOne();
  if (!deletedOcurrency) {
    throw new BadRequestError('Ocurrency not deleted');
  }
  if (ocurrency.public) {
    await client.lRem('public', 0, JSON.stringify(ocurrency.toObject()));
  }
  await client.lRem(`user:${ocurrency.userId}`, 0, JSON.stringify(ocurrency.toObject()));
  return;
};

export {
  getPublicOccurrecies,
  getUserOccurrecies,
  createOcurrency,
  deleteOcurrency,
  updateOcurrency
};
