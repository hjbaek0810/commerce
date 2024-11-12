import { NextResponse } from 'next/server';

import { deleteImages } from '@actions/upload';
import connectDB from '@api/config';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';

import type { SubCategoryVO } from '@api/category/types/vo';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page'));
    const limitNumber = Number(searchParams.get('limit'));

    const products = await ProductModel.find()
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .sort('-createdAt');

    const response = await Promise.all(
      products.map(async product => {
        const { _id: productCategoryId, subCategoryId: productSubCategoryId } =
          product.categoryIds;

        const category = await CategoryModel.findById(productCategoryId);

        let subCategory = null;

        if (category?.subCategory?.length > 0) {
          subCategory = category.subCategory.find(
            (subCat: SubCategoryVO) =>
              subCat._id.toString() === productSubCategoryId.toString(),
          );
        }

        const categoryData = subCategory ? subCategory : category;

        const { categoryIds, ...productData } = product._doc;

        return {
          ...productData,
          _id: product._id.toString(),
          categoryName: categoryData ? categoryData.name : null,
        };
      }),
    );

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
