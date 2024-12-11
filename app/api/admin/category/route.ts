import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import CategoryModel from '@api/models/category';
import ProductModel from '@api/models/product';
import SubCategoryModel from '@api/models/subCategory';

import type { AdminCreateCategory } from './types/dto';
import type { CategoryModelType } from '@api/models/category';
import type { ProductModelType } from '@api/models/product';
import type { NextRequest } from 'next/server';

enum AdminCategoryErrorType {
  CATEGORY_NOT_FOUND = 'A-CA-001',
  CATEGORY_NOT_UPDATED = 'A-CA-002',
  CATEGORY_REFERENCED = 'A-CA-003',
}

export async function GET() {
  try {
    await connectDB();

    const categories = await CategoryModel.find()
      .populate({
        path: 'subCategories',
        select: '_id name',
        model: SubCategoryModel,
      })
      .lean<CategoryModelType[]>();

    if (!categories.length) {
      return NextResponse.json([], { status: 200 });
    }

    // 카테고리와 서브카테고리 ID 추출
    const categoryIds = categories.map(category => category._id.toString());
    const subCategoryIds = categories.flatMap(category =>
      category.subCategories.map(subCategory => subCategory._id.toString()),
    );

    // 해당 카테고리/서브카테고리를 사용하는 상품 조회
    const products = await ProductModel.find(
      {
        $or: [
          { 'categoryIds._id': { $in: categoryIds } },
          { 'categoryIds.subCategoryId': { $in: subCategoryIds } },
        ],
      },
      'categoryIds',
    ).lean<ProductModelType[]>();

    const notDeletableCategoryMap = new Map();
    const notDeletableSubCategoryMap = new Map();

    products.forEach(product => {
      if (product.categoryIds._id) {
        notDeletableCategoryMap.set(product.categoryIds._id.toString(), true);
      }
      if (product.categoryIds.subCategoryId) {
        notDeletableSubCategoryMap.set(
          product.categoryIds.subCategoryId.toString(),
          true,
        );
      }
    });

    const response = categories.map(category => ({
      ...category,
      deletable: !notDeletableCategoryMap.has(category._id.toString()),
      subCategories: category.subCategories.map(subCategory => ({
        ...subCategory,
        deletable: !notDeletableSubCategoryMap.has(subCategory._id.toString()),
      })),
    }));

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load admin categories.',

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

    const deleteOperations = [];
    if (idsToDelete.length) {
      deleteOperations.push(
        CategoryModel.deleteMany({ _id: { $in: idsToDelete } }),
      );
    }
    if (subCategoryIdsToDelete.length) {
      deleteOperations.push(
        SubCategoryModel.deleteMany({ _id: { $in: subCategoryIdsToDelete } }),
      );
    }

    // 삭제 처리
    await Promise.all(deleteOperations);

    // 카테고리와 서브카테고리 생성 및 업데이트 처리
    const bulkCategoryOps = [];
    const bulkSubCategoryOps = [];

    for (const item of data) {
      let categoryId = item._id;

      const subCategoryIds = [];

      // 카테고리
      if (categoryId) {
        // 기존 카테고리 업데이트
        bulkCategoryOps.push({
          updateOne: {
            filter: { _id: categoryId },
            update: { $set: { name: item.name } },
          },
        });
      } else {
        // 새 카테고리 생성
        const newCategory = new CategoryModel({
          name: item.name,
          subCategories: [], // 처음엔 빈 배열로 시작
        });

        // 새 카테고리 저장 후 _id 받기
        const savedCategory = await newCategory.save();
        categoryId = savedCategory._id; // 새로 생성된 카테고리 ID를 가져옴
      }

      // 서브카테고리
      if (item.subCategories && item.subCategories.length > 0) {
        for (const subCategory of item.subCategories) {
          if (subCategory._id) {
            // 기존 서브카테고리 업데이트
            bulkSubCategoryOps.push({
              updateOne: {
                filter: { _id: subCategory._id },
                update: { $set: { name: subCategory.name, categoryId } },
              },
            });

            subCategoryIds.push(subCategory._id);
          } else {
            // 새 서브카테고리 생성
            if (categoryId) {
              const newSubCategory = new SubCategoryModel({
                name: subCategory.name,
                categoryId,
              });

              const savedSubCategory = await newSubCategory.save();
              subCategoryIds.push(savedSubCategory._id);
            }
          }
        }
      }

      if (subCategoryIds.length > 0) {
        bulkCategoryOps.push({
          updateOne: {
            filter: { _id: categoryId },
            update: {
              $set: { subCategories: subCategoryIds },
            },
          },
        });
      }

      if (bulkCategoryOps.length > 0) {
        await CategoryModel.bulkWrite(bulkCategoryOps);
      }

      if (bulkSubCategoryOps.length > 0) {
        await SubCategoryModel.bulkWrite(bulkSubCategoryOps);
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
