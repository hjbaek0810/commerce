import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import ProductModel from '@api/models/product';

export async function GET() {
  try {
    await connectDB();

    const response = await ProductModel.find().sort({ views: -1 }).limit(10);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load the top 10 products.',
      status: 400,
    });
  }
}
