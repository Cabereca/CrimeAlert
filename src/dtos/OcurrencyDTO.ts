import { Types } from 'mongoose';

export interface IOcurrency {
  _id: Types.UUID;
  userId: String;
  title: string;
  type: OcurrencyType;
  date: Date;
  time: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum OcurrencyType {
  theft,
  robbery,
  sexualHarassment,
  kidnapping,
  vandalism,
  other
}

export interface IOcurrencyMethods {
  getLatLng(): [number, number];
}
