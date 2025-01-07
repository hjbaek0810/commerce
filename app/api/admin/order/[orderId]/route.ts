import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/authOptions';
import connectDB from '@api/config/connectDB';
import { CommonErrorException } from '@api/exception';
import { checkSession } from '@api/helper/session';
import OrderModel from '@api/models/order';
import ProductModel from '@api/models/product';
import UserModel from '@api/models/user';

import type { OrderModelType } from '@api/models/order';
import type { NextRequest } from 'next/server';

export async function GET(
  _: NextRequest,
  { params }: { params: { orderId: string } },
) {
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

    if (!ObjectId.isValid(params.orderId)) {
      return NextResponse.json(
        {
          message: CommonErrorException.NOT_FOUND.message,
          code: CommonErrorException.NOT_FOUND.code,
        },
        { status: CommonErrorException.NOT_FOUND.status },
      );
    }

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
      },
    ];

    const adminOrder = await OrderModel.findById(params.orderId)
      .populate(populateOptions)
      .lean<OrderModelType>();

    const { _id, userId, productIds, ...order } = adminOrder || {};

    const response = {
      _id: _id?.toString(),
      userId: userId?._id,
      username: userId?.name,
      items: productIds?.map(item => ({
        product: item.productId || {},
        quantity: item.quantity,
        price: item.price,
      })),
      ...order,
      totalPrice: productIds
        ?.map(item => item.price * item.quantity)
        .reduce((total: number, price: number) => total + price, 0),
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load product.',
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
