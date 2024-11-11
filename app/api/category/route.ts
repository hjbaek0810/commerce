import { NextResponse } from 'next/server';

import connectDB from '@api/config';
import CategoryModel from '@api/models/category';

import type { CreateCategory } from './types/dto';
import type { AnyBulkWriteOperation } from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find();

    return NextResponse.json(categories, {
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

export async function PUT(req: Request) {
  const data: Array<CreateCategory> = await req.json();

  try {
    await connectDB();

    // 클라이언트로부터 전달된 _id 목록
    const incomingIds = data.map(item => item._id).filter(id => id);

    // 데이터베이스에서 기존 카테고리들의 _id 목록 조회
    const existingCategories = await CategoryModel.find({});
    const existingIds = existingCategories.map(category =>
      category._id.toString(),
    );

    // 삭제할 _id 목록
    const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));

    const bulkOperations: Array<AnyBulkWriteOperation> = data.map(item => {
      if (item._id) {
        // _id가 존재하면 업데이트
        return {
          updateOne: {
            filter: { _id: item._id },
            update: {
              $set: {
                name: item.name,
                subCategory: item.subCategory || [],
              },
            },
            upsert: true, // 없으면 삽입
          },
        };
      } else {
        // _id가 없으면 추가
        return {
          insertOne: {
            document: {
              name: item.name,
              subCategory: item.subCategory || [],
            },
          },
        };
      }
    });

    // 삭제
    if (idsToDelete.length) {
      bulkOperations.push(
        ...idsToDelete.map(id => ({
          deleteOne: { filter: { _id: id } },
        })),
      );
    }

    // 한 번에 bulkWrite 실행
    await CategoryModel.bulkWrite(bulkOperations);

    return NextResponse.json({
      status: 200,
      message: 'success',
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to update the categories.',
      status: 400,
    });
  }
}
