import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import ProductModel from '@api/models/product';
import { orderTags } from '@services/queries/order/keys';
import { productTags } from '@services/queries/product/keys';

import type { UpdateAdminProduct } from '../types/dto';
import type { NextRequest } from 'next/server';

enum AdminProductErrorType {
  PRODUCT_NOT_FOUND = 'APD-001',
}

export async function GET(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const sessionCheck = await checkSession(authOptions, true);

    if (!sessionCheck.isValid) {
      return NextResponse.json(
        {
          message: sessionCheck.message,
          code: sessionCheck.code,
        },
        { status: sessionCheck.status },
      );
    }

    await connectDB();

    const product = await ProductModel.findById(params.productId);

    if (!product) {
      return NextResponse.json(
        {
          message: 'Product not found',
          code: AdminProductErrorType.PRODUCT_NOT_FOUND,
        },
        { status: 404 },
      );
    }

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

export async function PUT(req: NextRequest) {
  const data: UpdateAdminProduct = await req.json();

  try {
    const sessionCheck = await checkSession(authOptions, true);

    if (!sessionCheck.isValid) {
      return NextResponse.json(
        {
          message: sessionCheck.message,
          code: sessionCheck.code,
        },
        { status: sessionCheck.status },
      );
    }

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

    revalidateTag(productTags.list);
    revalidateTag(productTags.detail(_id));
    revalidateTag(orderTags.all);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: `Failed to update product.`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const sessionCheck = await checkSession(authOptions, true);

    if (!sessionCheck.isValid) {
      return NextResponse.json(
        {
          message: sessionCheck.message,
          code: sessionCheck.code,
        },
        { status: sessionCheck.status },
      );
    }

    await connectDB();

    const deleteProduct = await ProductModel.findByIdAndDelete(
      params.productId,
    );

    if (!deleteProduct) {
      return NextResponse.json(
        {
          message: 'Product not found',
          code: AdminProductErrorType.PRODUCT_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    revalidateTag(productTags.list);
    revalidateTag(productTags.detail(params.productId));
    revalidateTag(orderTags.all);

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
      { status: 500 },
    );
  }
}
