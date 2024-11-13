import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import ProductModel from '@api/models/product';

import type { UpdateProduct } from '../types/dto';
import type { NextRequest} from 'next/server';

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

    const response = await ProductModel.findByIdAndUpdate(data._id, {
      $pull: {
        images: { publicId: { $in: deleteImageIds } }, // images 배열에서 _id가 deleteImageIds에 포함된 항목 삭제
      },
      $push: {
        images: { $each: images }, // 새 이미지를 기존 images 배열에 추가
      },
      ...restData,
    });

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
