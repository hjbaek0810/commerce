import { Client } from '@notionhq/client';
import mongoose from 'mongoose';

// TODO: remove
export const notion = new Client({
  auth: 'secret_DRKVmbYNIXIkZPaVF81JoHGkTy49unjEJw63OS4wmRe',
});

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');

    return true;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
