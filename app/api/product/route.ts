import { NextResponse } from 'next/server';

import { deleteImages } from '@actions/upload';
import connectDB from '@api/config';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';

import type { CreateProduct } from './types/dto';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const data: CreateProduct = await req.json();

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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page'));
    const limitNumber = Number(searchParams.get('limit'));

    const products = await ProductModel.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .sort('-createdAt')
      .populate({
        path: 'categoryIds._id',
        select: 'name',
        model: CategoryModel,
      })
      .populate({
        path: 'categoryIds.subCategoryId',
        select: 'name',
        model: SubCategoryModel,
      });

    const response = products.map(product => {
      const { _id: categoryData, subCategoryId: subCategoryData } =
        product.categoryIds || {};

      const categoryName = categoryData?.name ?? null;
      const subCategoryName = subCategoryData?.name ?? null;

      const getCategoryLabel = subCategoryName
        ? `${categoryName} - ${subCategoryName}`
        : categoryName;

      const { categoryIds, ...productData } = product._doc;

      return {
        ...productData,
        _id: product._id.toString(),
        category: {
          ...categoryIds,
          name: getCategoryLabel,
        },
      };
    });

    const count = await ProductModel.countDocuments();

    return NextResponse.json(
      {
        products: response,
        totalCount: count,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load products.',
      status: 400,
    });
  }
}

export async function Delete(req: NextRequest) {
  try {
    await connectDB();
    const { _id, publicId } = await req.json();

    await Promise.all([
      ProductModel.findOneAndDelete({ _id }),
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
