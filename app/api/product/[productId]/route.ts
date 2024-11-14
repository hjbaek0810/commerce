import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import ProductModel from '@api/models/product';

import type { UpdateProduct } from '../types/dto';
import type { NextRequest } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    await connectDB();

    const response = await ProductModel.findById(params.productId);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load product.',
      status: 400,
    });
  }
}

export async function PUT(req: NextRequest) {
  const data: UpdateProduct = await req.json();

  try {
    await connectDB();

    const { _id, images, deleteImageIds, ...restData } = data;

    const updateOperations = [];

    // 삭제할 이미지가 있으면 $pull 연산 추가
    if (deleteImageIds && deleteImageIds.length > 0) {
      updateOperations.push({
        updateOne: {
          filter: { _id },
          update: { $pull: { images: { publicId: { $in: deleteImageIds } } } },
        },
      });
    }

    // 새 이미지가 있으면 $push 연산 추가
    if (images && images.length > 0) {
      updateOperations.push({
        updateOne: {
          filter: { _id },
          update: { $push: { images: { $each: images } } },
        },
      });
    }

    if (Object.keys(restData).length) {
      updateOperations.push({
        updateOne: {
          filter: { _id },
          update: { $set: restData },
        },
      });
    }

    const response = await ProductModel.bulkWrite(updateOperations);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: `Failed to update product.`,
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    await connectDB();

    await ProductModel.findByIdAndDelete(params.productId);

    return NextResponse.json({
      message: 'success',
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: `Failed to delete product.`,
      },
      { status: 400 },
    );
  }
}
