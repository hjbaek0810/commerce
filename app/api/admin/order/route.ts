import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import OrderModel from '@api/models/order';
import ProductModel from '@api/models/product';
import UserModel from '@api/models/user';
import { OrderSortType } from '@utils/constants/order';

import type { SearchAdminOrder } from '@api/admin/order/types/dto';
import type { OrderProductVO } from '@api/order/types/vo';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

enum AdminOrderListErrorType {
  ORDER_LIST_NOT_FOUND = 'AOI-001',
}

type ProductItemType = {
  productId: OrderProductVO;
  quantity: number;
  price: number;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page')) || 1;
    const limitNumber = Number(searchParams.get('limit')) || 10;
    const useName = searchParams.get('userName');

    const sort = searchParams.get('sort') || OrderSortType.NEWEST;

    const filters: FilterQuery<SearchAdminOrder> = {};

    searchParams.forEach((value, key) => {
      if (
        value &&
        key !== 'page' &&
        key !== 'limit' &&
        key !== 'sort' &&
        key !== 'userName'
      ) {
        filters[key] = value;
      }
    });

    const userNameMatch = useName
      ? { name: { $regex: `^${useName}`, $options: 'i' } }
      : {};

    const populateOptions = [
      {
        path: 'productIds.productId',
        model: ProductModel,
        select: '_id name images',
      },
      {
        path: 'userId',
        model: UserModel,
        select: '_id name',
        match: userNameMatch,
      },
    ];

    const sortOptions: Record<string, 1 | -1> = {
      createdAt: sort === OrderSortType.NEWEST ? -1 : 1,
    };

    const adminOrderList = await OrderModel.find(filters)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .sort(sortOptions)
      .populate(populateOptions)
      .lean();

    const count = await OrderModel.find(filters)
      .populate(populateOptions)
      .countDocuments();

    const orders = adminOrderList.map(
      ({ _id, userId, productIds, ...order }) => ({
        _id: (_id as string).toString(),
        userId: userId._id,
        userName: userId.name,
        items: productIds.map((item: ProductItemType) => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        ...order,
        totalPrice: productIds
          .map((item: ProductItemType) => item.price * item.quantity)
          .reduce((total: number, price: number) => total + price, 0),
      }),
    );

    const response = {
      orders,
      currentPage: pageNumber,
      currentLimit: limitNumber,
      totalCount: count,
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load order list.',
      code: AdminOrderListErrorType.ORDER_LIST_NOT_FOUND,
      status: 400,
    });
  }
}
