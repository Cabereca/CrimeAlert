import { ICreateOcurrency, IOcurrency } from '../dtos/OcurrencyDTO';
import { BadRequestError, NotFoundError } from '../helpers/api-errors';
import { Ocurrency } from '../models/Ocurrency';
import { User } from '../models/User';

const GetPublicOccurrecies = async () => {
  const ocurrency = await Ocurrency.find({
    public: true
  });
  return ocurrency.map((ocurrency) => {
    return ocurrency.toObject();
  });
};

const GetUserOccurrecies = async (userId: string) => {
  if (!userId) {
    throw new BadRequestError('User id is required');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  const ocurrency = await Ocurrency.find({
    userId: userId
  });
  return ocurrency.map((ocurrency) => {
    return ocurrency.toObject();
  });
};

const CreateOcurrency = async (ocurrencyData: ICreateOcurrency) => {
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
  return newOcurrency.toObject();
};

const UpdateOcurrency = async (id: string, newData: Partial<IOcurrency>) => {
  if (!id) {
    throw new BadRequestError('Ocurrency id is required');
  }
  const ocurrency = await Ocurrency.findById(id);
  console.log(ocurrency);

  if (!ocurrency) {
    throw new NotFoundError('Ocurrency not found');
  }
  const updatedOcurrency = await Ocurrency.findByIdAndUpdate(id, newData, {
    new: true
  });
  console.log(updatedOcurrency);

  if (!updatedOcurrency) {
    throw new BadRequestError('Ocurrency not updated');
  }
  return updatedOcurrency.toObject();
};

const DeleteOcurrency = async (id: string) => {
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
  return;
};

export {
  GetPublicOccurrecies,
  GetUserOccurrecies,
  CreateOcurrency,
  DeleteOcurrency,
  UpdateOcurrency
};
