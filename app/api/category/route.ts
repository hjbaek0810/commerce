import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import CategoryModel from '@api/models/category';

export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find();

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `failed: ${error}` },
      {
        status: 400,
      },
    );
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    await connectDB();
    await CategoryModel.create(data);

    return NextResponse.json(
      { message: 'success' },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `failed: ${error}` },
      {
        status: 400,
      },
    );
  }
}
