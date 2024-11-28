import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';

import type { CreateProduct, SearchProduct } from './types/dto';
import type { FilterQuery } from 'mongoose';
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

    const filters: FilterQuery<SearchProduct> = {};

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
      });

    const response = products.map(product => {
      const { categoryIds, ...productData } = product._doc;

      const categoryId = {
        _id: categoryIds?._id?._id ?? null,
        name: categoryIds?._id?.name ?? null,
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

    return NextResponse.json({
      message: 'Failed to load products.',
      status: 400,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();

    await ProductModel.findOneAndDelete({ _id });

    return NextResponse.json({ message: 'success', status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to delete the product.',
      status: 400,
    });
  }
}
