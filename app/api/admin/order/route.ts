import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { shouldFilterKey } from '@api/helper/filter';
import { checkSession } from '@api/helper/session';
import OrderModel from '@api/models/order';
import ProductModel from '@api/models/product';
import UserModel from '@api/models/user';
import { productTags } from '@services/queries/product/keys';
import { OrderSortType, OrderStatus } from '@utils/constants/order';
import { ProductStatusType } from '@utils/constants/product';

import type {
  SearchAdminOrder,
  UpdateAdminOrder,
} from '@api/admin/order/types/dto';
import type { OrderModelType } from '@api/models/order';
import type { SortCriteria } from '@api/types';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

enum AdminOrderListErrorType {
  ORDER_LIST_NOT_FOUND = 'AOI-001',
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

    const pageNumber = Number(searchParams.get('page')) || 1;
    const limitNumber = Number(searchParams.get('limit')) || 10;
    const useName = searchParams.get('username');

    const sort = searchParams.get('sort') || OrderSortType.NEWEST;

    const filters: FilterQuery<SearchAdminOrder> = {};

    searchParams.forEach((value, key) => {
      if (shouldFilterKey(key, value, ['username'])) {
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
        select: '_id name images quantity',
      },
      {
        path: 'userId',
        model: UserModel,
        select: '_id name',
        match: userNameMatch,
      },
    ];

    const sortOptions: SortCriteria = {
      createdAt: sort === OrderSortType.NEWEST ? -1 : 1,
    };

    const adminOrderList = await OrderModel.find(filters)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .sort(sortOptions)
      .populate(populateOptions)
      .lean<OrderModelType[]>();

    const count = await OrderModel.find(filters)
      .populate(populateOptions)
      .countDocuments();

    const orders = adminOrderList.map(
      ({ _id, userId, productIds, ...order }) => ({
        _id: _id.toString(),
        userId: userId._id,
        username: userId.name,
        items:
          productIds?.map(item => ({
            product: item.productId || null,
            quantity: item.quantity,
            price: item.price,
          })) || [],
        ...order,
        totalPrice: productIds
          .map(item => item.price * item.quantity)
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

    return NextResponse.json(
      {
        message: 'Failed to load order list.',
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const data: UpdateAdminOrder = await req.json();

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

    const { _id, status } = data;

    const order = await OrderModel.findById(_id);

    if (!order) {
      return NextResponse.json(
        {
          message: 'Order not found',
          code: AdminOrderListErrorType.ORDER_LIST_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    const isCancelledOrder =
      status === OrderStatus.REFUND_COMPLETED ||
      status === OrderStatus.RETURN_COMPLETED;

    if (isCancelledOrder) {
      const { productIds } = order;

      for (const product of productIds) {
        await ProductModel.updateOne({ _id: product.productId }, [
          {
            $set: {
              quantity: { $add: ['$quantity', product.quantity] }, // quantity 값을 증가시킴
              status: {
                $cond: {
                  if: { $gte: [{ $add: ['$quantity', product.quantity] }, 0] }, // quantity가 0 이상이면
                  then: ProductStatusType.IN_PROGRESS,
                  else: '$status', // 그렇지 않으면 기존 status 유지
                },
              },
            },
          },
        ]);
        revalidateTag(productTags.detail(product.productId));
        revalidateTag(productTags.adminDetail(product.productId));
      }

      revalidateTag(productTags.list);
      revalidateTag(productTags.adminList);
    }

    const updateOrder = await OrderModel.updateOne(
      { _id },
      {
        $set: {
          status,
        },
      },
    );

    if (!updateOrder) {
      return NextResponse.json(
        {
          message: 'Order not found',
          code: AdminOrderListErrorType.ORDER_LIST_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'success',
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: `Failed to update order list.`,
      },
      { status: 500 },
    );
  }
}
