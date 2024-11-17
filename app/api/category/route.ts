import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';

import type { CreateCategory } from './types/dto';
import type { NextRequest } from 'next/server';

enum CategoryErrorType {
  CATEGORY_NOT_FOUND = 'CA-001',
  CATEGORY_NOT_UPDATED = 'CA-002',
  CATEGORY_REFERENCED = 'CA-003',
}

export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find().populate('subCategories');

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

export async function PUT(req: NextRequest) {
  const data: Array<CreateCategory> = await req.json();

  try {
    await connectDB();

    const existingCategories = await CategoryModel.find({});
    const existingSubCategories = await SubCategoryModel.find({});

    const existingCategoryIds = existingCategories.map(category =>
      category._id.toString(),
    );
    const existingSubCategoryIds = existingSubCategories.map(subCategory =>
      subCategory._id.toString(),
    );

    const newCategoryIds = data.map(item => item._id).filter(id => id); // 새로 입력된 카테고리

    // 삭제할 카테고리 및 서브카테고리 ID
    const idsToDelete = existingCategoryIds.filter(
      _id => !newCategoryIds.includes(_id),
    );
    const subCategoryIdsToDelete = existingSubCategoryIds.filter(
      _id => !newCategoryIds.includes(_id),
    );

    const [productsWithCategories, productsWithSubCategories] =
      await Promise.all([
        ProductModel.find({ 'categoryIds._id': { $in: idsToDelete } }),
        ProductModel.find({
          'categoryIds.subCategoryId': { $in: subCategoryIdsToDelete },
        }),
      ]);

    if (
      productsWithCategories.length > 0 ||
      productsWithSubCategories.length > 0
    ) {
      return NextResponse.json(
        {
          message:
            '카테고리 또는 서브카테고리가 상품에 참조되어 있어 삭제할 수 없습니다.',
          code: CategoryErrorType.CATEGORY_REFERENCED,
        },
        { status: 400 },
      );
    }

    // 삭제
    if (idsToDelete.length) {
      await CategoryModel.deleteMany({
        _id: { $in: idsToDelete },
      });
    }

    if (subCategoryIdsToDelete.length) {
      await SubCategoryModel.deleteMany({
        _id: { $in: subCategoryIdsToDelete },
      });
    }

    // 카테고리와 서브카테고리 생성 및 업데이트 처리
    for (const item of data) {
      let categoryId = item._id;
      const subCategoryIds = [];

      // 카테고리
      if (categoryId) {
        // 기존 카테고리 업데이트
        await CategoryModel.updateOne(
          { _id: categoryId },
          {
            $set: { name: item.name },
          },
          { upsert: true },
        );
      } else {
        // 새 카테고리 생성
        const newCategory = new CategoryModel({
          name: item.name,
          subCategories: [], // 처음엔 빈 배열로 시작
        });
        const savedCategory = await newCategory.save();
        categoryId = savedCategory._id; // 새로 생성된 카테고리 _id
      }

      // 서브카테고리
      if (item.subCategories && item.subCategories.length > 0) {
        for (const subCategory of item.subCategories) {
          if (subCategory._id) {
            // 기존 서브카테고리 업데이트
            await SubCategoryModel.updateOne(
              { _id: subCategory._id },
              {
                $set: {
                  name: subCategory.name,
                  categoryId,
                },
              },
              { upsert: true },
            );
            subCategoryIds.push(subCategory._id);
          } else {
            // 새 서브카테고리 생성
            const newSubCategory = new SubCategoryModel({
              name: subCategory.name,
              categoryId,
            });
            const savedSubCategory = await newSubCategory.save();
            subCategoryIds.push(savedSubCategory._id); // 새로 생성된 서브카테고리 _id
          }
        }

        // 카테고리 업데이트 시 서브카테고리 _id 연결
        await CategoryModel.updateOne(
          { _id: categoryId },
          { $set: { subCategories: subCategoryIds } },
        );
      }
    }

    return NextResponse.json({
      status: 200,
      message: 'success',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to update the categories.',
      code: CategoryErrorType.CATEGORY_NOT_UPDATED,
      status: 400,
    });
  }
}
