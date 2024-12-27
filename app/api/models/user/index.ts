import { Schema, model, models } from 'mongoose';

import type { InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: '',
    },
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
    loginType: {
      type: String,
      enum: ['CREDENTIALS', 'GOOGLE'],
      default: 'CREDENTIALS',
      required: true,
    },
    telephone: { type: String, required: true, default: '' },
    postCode: { type: String, default: '' },
    address: { type: String, default: '' },
    subAddress: { type: String, default: '' },
    emailVerified: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true, collection: 'users' },
);

const UserModel = models.User || model('User', UserSchema);

export type UserModelType = InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export default UserModel;
