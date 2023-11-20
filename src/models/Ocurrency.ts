import { Model, Schema } from 'mongoose';
import mongoose from '../database/mongoose';
import { IOcurrency, IOcurrencyMethods } from '../dtos/OcurrencyDTO';

type OcurrencyModel = Model<IOcurrency, {}, IOcurrencyMethods>;

const OcurrencySchema = new Schema<
  IOcurrency,
  OcurrencyModel,
  IOcurrencyMethods
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: String,
    type: String,
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true,
      default: '00:00'
    },
    public: {
      type: Boolean,
      required: true
    },
    location: {
      type: {
        type: String,
        required: true,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    }
  },
  { timestamps: true }
);
OcurrencySchema.method('getLatLng', function (): [number, number] {
  const { coordinates } = this.location;
  return [coordinates[0], coordinates[1]];
});

const Ocurrency = mongoose.model('Ocurrency', OcurrencySchema);

export { Ocurrency, OcurrencySchema };
