import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';
import { ProductSortType } from '@utils/constants/product';

import type { SearchProduct } from './types/dto';
import type { FilterQuery, SortOrder } from 'mongoose';
import type { NextRequest } from 'next/server';

type SortCriteria = {
  createdAt?: SortOrder;
  views?: SortOrder;
  price?: SortOrder;
  salePrice?: SortOrder;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page'));
    const limitNumber = Number(searchParams.get('limit'));

    const sort = searchParams.get('sort') || 'newest';

    // 정렬 기준 처리
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
        sortCriteria = { salePrice: -1, price: -1 };
        break;
      case ProductSortType.PRICE_LOW:
        sortCriteria = { salePrice: 1, price: 1 };
        break;
    }

    const filters: FilterQuery<SearchProduct> = {};

    searchParams.forEach((value, key) => {
      if (value && key !== 'page' && key !== 'limit' && key !== 'sort') {
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
      });

    const response = products.map(product => {
      const { categoryIds, ...productData } = product._doc;

      const categoryId = {
        _id: categoryIds?._id?._id ?? null,
        name: categoryIds?._id?.name ?? null,
        subCategory: {
          _id: categoryIds?.subCategoryId?._id ?? null,
          name: categoryIds?.subCategoryId?.name ?? null,
        },
      };

      return {
        ...productData,
        _id: product._id.toString(),
        category: categoryId,
      };
    });

    const count = await ProductModel.countDocuments(filters);

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

    return NextResponse.json({
      message: 'Failed to load products.',
      status: 400,
    });
  }
}
