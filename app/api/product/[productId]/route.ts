import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import { CommonErrorException } from '@api/exception';
import ProductModel from '@api/models/product';

import type { NextRequest } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    await connectDB();

    if (!ObjectId.isValid(params.productId)) {
      return NextResponse.json(
        {
          message: CommonErrorException.NOT_FOUND.message,
          code: CommonErrorException.NOT_FOUND.code,
        },
        { status: CommonErrorException.NOT_FOUND.status },
      );
    }

    const product = await ProductModel.findById(params.productId);

    if (!product) {
      return NextResponse.json(
        {
          message: CommonErrorException.NOT_FOUND.message,
          code: CommonErrorException.NOT_FOUND.code,
        },
        { status: CommonErrorException.NOT_FOUND.status },
      );
    }

    product.views += 1;
    await product.save();

    return NextResponse.json(product, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load product.',
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
