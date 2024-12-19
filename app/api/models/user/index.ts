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
      require: true,
    },
    picture: {
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
      default: null,
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
    postCode: { type: String, default: '' },
    address: { type: String, default: '' },
    subAddress: { type: String, default: '' },
  },
  { collection: 'users' },
);

const UserModel = models.User || model('User', UserSchema);

export type UserModelType = InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export default UserModel;
