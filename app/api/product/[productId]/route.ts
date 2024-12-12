import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import ProductModel from '@api/models/product';

import type { NextRequest } from 'next/server';

enum ProductErrorType {
  PRODUCT_NOT_FOUND = 'PD-001',
}

export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    await connectDB();

    const product = await ProductModel.findById(params.productId);

    if (!product) {
      return NextResponse.json(
        {
          message: 'Product not found',
          code: ProductErrorType.PRODUCT_NOT_FOUND,
        },
        { status: 404 },
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
      { status: 500 },
    );
  }
}
