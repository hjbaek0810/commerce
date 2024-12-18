import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';

import type { CreateAdminProduct, SearchAdminProduct } from './types/dto';
import type { ProductModelType } from '@api/models/product';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

enum AdminProductErrorType {
  PRODUCT_NOT_FOUND = 'AP-001',
}

export async function POST(req: NextRequest) {
  const data: CreateAdminProduct = await req.json();

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
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
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

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page'));
    const limitNumber = Number(searchParams.get('limit'));

    const filters: FilterQuery<SearchAdminProduct> = {};

    searchParams.forEach((value, key) => {
      if (value && key !== 'page' && key !== 'limit') {
        switch (key) {
          case 'category':
            filters['categoryIds._id'] = value;
            break;
          case 'subCategory':
            filters['categoryIds.subCategoryId'] = value;
            break;
          default:
            filters[key] = value;
            break;
        }
      }
    });

    const products = await ProductModel.find(filters)
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
      })
      .lean<ProductModelType[]>();

    const response = products.map(product => {
      const { categoryIds, ...productData } = product || {};

      const categoryId = {
        _id: categoryIds._id._id ?? null,
        name: categoryIds._id.name ?? null,
        subCategory: categoryIds?.subCategoryId?._id
          ? {
              _id: categoryIds?.subCategoryId?._id ?? null,
              name: categoryIds?.subCategoryId?.name ?? null,
            }
          : {},
      };

      return {
        ...productData,
        _id: product._id.toString(),
        category: categoryId,
      };
    });

    const count = await ProductModel.countDocuments();

    return NextResponse.json(
      {
        products: response,
        currentPage: pageNumber,
        currentLimit: limitNumber,
        totalCount: count,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load products.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const { _id } = await req.json();

    const deleteProduct = await ProductModel.findOneAndDelete({ _id });
    if (!deleteProduct) {
      return NextResponse.json(
        {
          message: 'Product not found',
          code: AdminProductErrorType.PRODUCT_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'success', status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to delete the product.',
      },
      { status: 500 },
    );
  }
}
