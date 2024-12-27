import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { shouldFilterKey } from '@api/helper/filter';
import { checkSession } from '@api/helper/session';
import OrderModel from '@api/models/order';
import ProductModel from '@api/models/product';
import { productTags } from '@services/queries/product/keys';
import { OrderSortType, OrderStatus } from '@utils/constants/order';
import { ProductStatusType } from '@utils/constants/product';

import type {
  SearchAdminOrder,
  UpdateAdminOrder,
} from '@api/admin/order/types/dto';
import type { OrderModelType } from '@api/models/order';
import type { UserModelType } from '@api/models/user';
import type { SortCriteria } from '@api/types';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

enum AdminOrderListErrorType {
  ORDER_LIST_NOT_FOUND = 'AOI-001',
}

type CustomAdminOrderModelType = Omit<OrderModelType, 'userId'> & {
  user: UserModelType;
};

type CustomAdminOrderDataType = {
  data: Array<CustomAdminOrderModelType>;
  totalCount: number;
};

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
    const sort = searchParams.get('sort') || OrderSortType.NEWEST;
    const status = (searchParams.get('status') || '').split(',');
    const orderId = searchParams.get('_id');
    const userId = searchParams.get('userId');
    const useName = searchParams.get('username');

    const filters: FilterQuery<SearchAdminOrder> = {};

    searchParams.forEach((value, key) => {
      if (shouldFilterKey(key, value, ['userId', 'username', '_id'])) {
        switch (key) {
          case 'status':
            filters['$or'] = status?.map(status => ({ status }));
            break;
          default:
            filters[key] = value;
            break;
        }
      }
    });

    const sortOptions: SortCriteria = {
      createdAt: sort === OrderSortType.NEWEST ? -1 : 1,
    };

    const adminOrderData = await OrderModel.aggregate<CustomAdminOrderDataType>(
      [
        {
          $match: filters,
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productIds.productId',
            foreignField: '_id',
            as: 'products',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            orderNum: { $toString: '$_id' },
            userNum: { $toString: '$userId' },
            items: {
              $map: {
                input: '$productIds',
                as: 'item',
                in: {
                  product: {
                    $cond: {
                      if: { $not: ['$$item.productId'] }, // productId가 없거나 null인 경우
                      then: {},
                      else: '$$item.productId',
                    },
                  },
                  quantity: '$$item.quantity',
                  price: '$$item.price',
                },
              },
            },
            totalPrice: {
              $sum: {
                $map: {
                  input: '$productIds',
                  as: 'item',
                  in: { $multiply: ['$$item.price', '$$item.quantity'] },
                },
              },
            },
          },
        },
        {
          $facet: {
            totalCount: [
              {
                $match: {
                  orderNum: { $regex: `^${orderId || ''}`, $options: 'i' },
                  userNum: { $regex: `^${userId || ''}`, $options: 'i' },
                  'user.name': { $regex: `^${useName || ''}`, $options: 'i' },
                },
              },
              {
                $count: 'totalCount',
              },
            ],
            data: [
              {
                $match: {
                  orderNum: { $regex: `^${orderId || ''}`, $options: 'i' },
                  userNum: { $regex: `^${userId || ''}`, $options: 'i' },
                  'user.name': { $regex: `^${useName || ''}`, $options: 'i' },
                },
              },
              { $sort: sortOptions },
              { $skip: (pageNumber - 1) * limitNumber },
              { $limit: limitNumber },
              {
                $project: {
                  userId: 0,
                  products: 0,
                  productIds: 0,
                  orderNum: 0,
                  userNum: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            totalCount: { $arrayElemAt: ['$totalCount.totalCount', 0] },
            data: 1,
          },
        },
      ],
    );

    const totalCount = adminOrderData[0]?.totalCount || 0;
    const adminOrderList = adminOrderData[0]?.data || [];

    const orders = adminOrderList?.map(({ _id, user, ...order }) => ({
      _id: _id.toString(),
      userId: user._id.toString(),
      username: user.name,
      ...order,
    }));

    const response = {
      orders,
      currentPage: pageNumber,
      currentLimit: limitNumber,
      totalCount,
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
