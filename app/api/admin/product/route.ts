import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { shouldFilterKey } from '@api/helper/filter';
import { checkSession } from '@api/helper/session';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';
import { productTags } from '@services/queries/product/keys';
import { ProductSortType } from '@utils/constants/product';

import type { CreateAdminProduct, SearchAdminProduct } from './types/dto';
import type { ProductModelType } from '@api/models/product';
import type { SortCriteria } from '@api/types';
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

    const product = await ProductModel.create(data);

    revalidateTag(productTags.list);

    return NextResponse.json(product._doc, {
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
    const sort = searchParams.get('sort') || ProductSortType.NEWEST;

    let sortCriteria: SortCriteria = { createdAt: -1 }; // 기본값: 최신 순

    switch (sort) {
      case ProductSortType.NEWEST:
        sortCriteria = { createdAt: -1 };
        break;
      case ProductSortType.OLDEST:
        sortCriteria = { createdAt: 1 };
        break;
      case ProductSortType.POPULARITY:
        sortCriteria = { views: -1 };
        break;
      case ProductSortType.PRICE_HIGH:
        sortCriteria = { effectivePrice: -1 };
        break;
      case ProductSortType.PRICE_LOW:
        sortCriteria = { effectivePrice: 1 };
        break;
    }

    const filters: FilterQuery<SearchAdminProduct> = {};

    searchParams.forEach((value, key) => {
      if (shouldFilterKey(key, value)) {
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
      .sort(sortCriteria)
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
