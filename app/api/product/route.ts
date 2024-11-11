import { NextResponse } from 'next/server';

import { deleteImages } from '@actions/upload';
import connectDB from '@api/config';
import ProductModel from '@api/models/product';


export async function POST(req: Request) {
  const data = await req.json();

  try {
    await connectDB();
    const response = await ProductModel.create(data);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: `Failed to register product.`,
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find().sort('-createdAt'); // -는 desc
    const response = products.map(product => ({
      ...product._doc,
      _id: product._id.toString(),
    }));

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load products.',
      status: 400,
    });
  }
}

export async function Delete(id: string, publicId: string) {
  try {
    await Promise.all([
      ProductModel.findOneAndDelete({ _id: id }),
      deleteImages(publicId),
    ]);

    return NextResponse.json({ message: 'success', status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to delete the product.',
      status: 400,
    });
  }
}
