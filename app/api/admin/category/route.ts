import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';

import type { AdminCreateCategory } from './types/dto';
import type { AdminCategoryVO } from './types/vo';
import type { NextRequest } from 'next/server';

enum AdminCategoryErrorType {
  CATEGORY_NOT_FOUND = 'A-CA-001',
  CATEGORY_NOT_UPDATED = 'A-CA-002',
  CATEGORY_REFERENCED = 'A-CA-003',
}

export async function GET() {
  try {
    await connectDB();

    const categories = (await CategoryModel.find()
      .populate({
        path: 'subCategories',
        model: SubCategoryModel,
      })
      .lean()) as Array<AdminCategoryVO>;

    const categoryIds = categories.map(category => category._id.toString());
    const subCategoryIds = categories.flatMap(item =>
      item.subCategories.map(subCategory => subCategory._id.toString()),
    );

    if (categoryIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const productsWithCategory = await ProductModel.find({
      $or: [
        { 'categoryIds._id': { $in: categoryIds } },
        { 'categoryIds.subCategoryId': { $in: subCategoryIds } },
      ],
    }).select('categoryIds');

    const notDeletableCategoryIds = productsWithCategory.map(product => ({
      categoryId: product.categoryIds._id.toString(),
      ...(product.categoryIds.subCategoryId && {
        subCategoryId: product.categoryIds.subCategoryId.toString(),
      }),
    }));

    const uniqueNotDeletableCategoryIds = [
      ...new Set(notDeletableCategoryIds.map(item => item.categoryId)),
    ];

    const uniqueNotDeletableSubCategoryIds = [
      ...new Set(
        notDeletableCategoryIds
          .filter(item => item.subCategoryId)
          .map(item => item.subCategoryId),
      ),
    ];

    const response = categories.map(category => ({
      ...category,
      deletable: !uniqueNotDeletableCategoryIds.includes(
        category._id.toString(),
      ),
      subCategories: category.subCategories.map(subCategory => ({
        ...subCategory,
        deletable: !uniqueNotDeletableSubCategoryIds.includes(
          subCategory._id.toString(),
        ),
      })),
    }));

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load categories.',

      status: 400,
    });
  }
}

export async function PUT(req: NextRequest) {
  const data: Array<AdminCreateCategory> = await req.json();

  try {
    await connectDB();

    const [existingCategories, existingSubCategories] = await Promise.all([
      CategoryModel.find({}, '_id'),
      SubCategoryModel.find({}, '_id'),
    ]);

    // 참조 모델 id만 반환
    const existingCategoryIds = existingCategories.map(category =>
      category._id.toString(),
    );
    const existingSubCategoryIds = existingSubCategories.map(subCategory =>
      subCategory._id.toString(),
    );

    // 사용자에게 입력받은 아이디
    const formCategoryIds = data.map(item => item._id).filter(id => id);
    const formSubCategoryIds = data
      .flatMap(item => item.subCategories.map(subCategory => subCategory._id))
      .filter(id => id);

    // 삭제할 카테고리 및 서브카테고리 ID (참조 모델의 id에 입력받은 id가 없으면 삭제한걸로 간주)
    const idsToDelete = existingCategoryIds.filter(
      _id => !formCategoryIds.includes(_id),
    );
    const subCategoryIdsToDelete = existingSubCategoryIds.filter(
      _id => !formSubCategoryIds.includes(_id),
    );

    // 삭제 시 상품에 참조되어있으면 삭제 불가능
    const productsRelatedToDelete = await ProductModel.find({
      $or: [
        { 'categoryIds._id': { $in: idsToDelete } },
        { 'categoryIds.subCategoryId': { $in: subCategoryIdsToDelete } },
      ],
    });

    if (productsRelatedToDelete.length > 0) {
      return NextResponse.json(
        {
          message:
            '카테고리 또는 서브카테고리가 상품에 참조되어 있어 삭제할 수 없습니다.',
          code: AdminCategoryErrorType.CATEGORY_REFERENCED,
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
      code: AdminCategoryErrorType.CATEGORY_NOT_UPDATED,
      status: 400,
    });
  }
}
