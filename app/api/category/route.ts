import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import CategoryModel from '@api/models/category';
import SubCategoryModel from '@api/models/subCategory';

enum CategoryErrorType {
  CATEGORY_NOT_FOUND = 'CA-001',
}

export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find().populate({
      path: 'subCategories',
      model: SubCategoryModel,
    });

    return NextResponse.json(categories, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load categories.',
      code: CategoryErrorType.CATEGORY_NOT_FOUND,
      status: 400,
    });
  }
}
