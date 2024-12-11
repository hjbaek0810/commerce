import { Schema, model, models } from 'mongoose';

import type { InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
    },
    // new
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
