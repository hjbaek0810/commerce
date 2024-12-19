import { Schema, model, models } from 'mongoose';

import type { InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
      default: '',
    },
    emailVerified: {
      type: Boolean,
      default: null,
    },
    // New
    loginId: {
      type: String,
      unique: true,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    telephone: { type: String, required: true },
    postCode: { type: String },
    address: { type: String },
    subAddress: { type: String },
  },
  { collection: 'users' },
);

const UserModel = models.User || model('User', UserSchema);

export type UserModelType = InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export default UserModel;
