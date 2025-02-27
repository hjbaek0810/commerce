import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import { CommonErrorException } from '@api/exception';
import { shouldFilterKey } from '@api/helper/filter';
import ProductModel from '@api/models/product';
import { ProductSortType, ProductStatusType } from '@utils/constants/product';

import type { SearchProduct } from './types/dto';
import type { SortCriteria } from '@api/types';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page'));
    const limitNumber = Number(searchParams.get('limit'));

    const sort = searchParams.get('sort') || ProductSortType.NEWEST;

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
        sortCriteria = { effectivePrice: -1 };
        break;
      case ProductSortType.PRICE_LOW:
        sortCriteria = { effectivePrice: 1 };
        break;
    }

    const filters: FilterQuery<SearchProduct> = {};

    searchParams.forEach((value, key) => {
      if (shouldFilterKey(key, value, ['hiddenSoldOut'])) {
        switch (key) {
          case 'category':
            filters['categoryIds._id'] = new mongoose.Types.ObjectId(value);
            break;
          case 'subCategory':
            filters['categoryIds.subCategoryId'] = new mongoose.Types.ObjectId(
              value,
            );
            break;
          case 'name':
            filters[key] = { $regex: `.*${value}.*`, $options: 'i' };
            break;
          default:
            filters[key] = value;
            break;
        }
      }
    });

    if (searchParams.get('hiddenSoldOut')) {
      filters['status'] = {
        $nin: [ProductStatusType.HIDDEN, ProductStatusType.STOPPED],
      };
    } else {
      filters['status'] = { $ne: ProductStatusType.HIDDEN };
    }

    const products = await ProductModel.aggregate([
      {
        $match: filters,
      },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $ne: ['$salePrice', null] }, // salePrice가 null이 아닌 경우
              then: '$salePrice',
              else: '$price', // salePrice가 null이면 price 사용
            },
          },
        },
      },
      { $sort: sortCriteria },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryIds._id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'categoryIds.subCategoryId',
          foreignField: '_id',
          as: 'subCategory',
        },
      },
      {
        $project: {
          categoryIds: 0,
          effectivePrice: 0,
        },
      },
    ]);

    const count = await ProductModel.countDocuments(filters);

    return NextResponse.json(
      {
        products,
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
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
