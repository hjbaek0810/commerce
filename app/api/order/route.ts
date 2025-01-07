import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/authOptions';
import connectDB from '@api/config/connectDB';
import { CommonErrorException, OrderErrorException } from '@api/exception';
import { checkSession } from '@api/helper/session';
import CartModel from '@api/models/cart';
import OrderModel from '@api/models/order';
import ProductModel from '@api/models/product';
import UserModel from '@api/models/user';
import { dashboardTags } from '@services/queries/dashboard/keys';
import { orderTags } from '@services/queries/order/keys';
import { productTags } from '@services/queries/product/keys';
import { OrderStatus } from '@utils/constants/order';
import { ProductStatusType } from '@utils/constants/product';

import type { OrderModelType } from '@api/models/order';
import type { CreateOrder, UpdateOrder } from '@api/order/types/dto';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const sessionCheck = await checkSession(authOptions);

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

    const { userId: sessionUserId } = sessionCheck;

    const { searchParams } = req.nextUrl;

    const pageNumber = Number(searchParams.get('page')) || 1;
    const limitNumber = Number(searchParams.get('limit')) || 10;

    const orderList = await OrderModel.find({ userId: sessionUserId })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .sort({ createdAt: -1 })
      .populate({
        path: 'productIds.productId',
        model: ProductModel,
        select: '_id name images',
      })
      .populate({
        path: 'userId',
        model: UserModel,
        select: 'name',
      })
      .lean<OrderModelType[]>();

    const orders = orderList.map(({ _id, productIds, userId, ...order }) => ({
      _id: _id.toString(),
      userId: userId._id,
      username: userId.name,
      items:
        productIds?.map(item => ({
          product: item.productId || {},
          quantity: item.quantity,
          price: item.price,
        })) || [],
      ...order,
      totalPrice: productIds
        .map(item => item.price * item.quantity)
        .reduce((total: number, price: number) => total + price, 0),
    }));

    const count = await OrderModel.countDocuments({ userId: sessionUserId });

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
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}

export async function POST(req: NextRequest) {
  const data: CreateOrder = await req.json();

  try {
    const sessionCheck = await checkSession(authOptions);

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

    const { userId } = sessionCheck;
    const { products, fromCart, ...restData } = data;

    await OrderModel.create({
      userId,
      productIds: products.map(({ _id, quantity, price }) => ({
        productId: _id,
        quantity,
        price,
      })),
      fromCart,
      ...restData,
    });

    revalidateTag(orderTags.adminList);
    revalidateTag(dashboardTags.order);

    for (const item of products) {
      const product = await ProductModel.findById(item._id);

      if (!product) {
        return NextResponse.json(
          {
            message: CommonErrorException.NOT_FOUND.message,
            code: CommonErrorException.NOT_FOUND.code,
          },
          { status: CommonErrorException.NOT_FOUND.status },
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          {
            message: OrderErrorException.EXCEED_QUANTITY.message,
            code: OrderErrorException.EXCEED_QUANTITY.code,
          },
          { status: OrderErrorException.EXCEED_QUANTITY.status },
        );
      }

      product.quantity -= item.quantity;

      if (product.quantity === 0) {
        product.status = ProductStatusType.STOPPED;
      }

      await product.save();

      productTags.detail(item._id);
      productTags.adminDetail(item._id);
    }

    revalidateTag(productTags.list);

    if (fromCart) {
      const productIds = products.map(({ _id }) => _id);

      await CartModel.updateOne(
        { _id: userId },
        { $pull: { productIds: { productId: { $in: productIds } } } },
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
        message: `Failed to upload order list.`,
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}

export async function PUT(req: NextRequest) {
  const data: UpdateOrder = await req.json();

  try {
    const sessionCheck = await checkSession(authOptions);

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

    const { userId } = sessionCheck;

    const { _id, status, paymentType } = data;

    const order = await OrderModel.findById(_id)
      .populate({
        path: 'userId',
        model: UserModel,
        match: { _id: userId },
      })
      .lean<OrderModelType>();

    if (!order) {
      return NextResponse.json(
        {
          message: CommonErrorException.NOT_FOUND.message,
          code: CommonErrorException.NOT_FOUND.code,
        },
        { status: CommonErrorException.NOT_FOUND.status },
      );
    }

    const isCancelledOrder = status === OrderStatus.ORDER_CANCELLED;

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
        revalidateTag(productTags.detail(product.productId.toString()));
        revalidateTag(productTags.adminDetail(product.productId.toString()));
      }

      revalidateTag(productTags.list);
      revalidateTag(productTags.adminList);
    }

    const updateOrder = await OrderModel.updateOne(
      { _id, userId },
      {
        $set: {
          status,
          ...(paymentType && { paymentType }),
        },
      },
    );

    if (!updateOrder) {
      return NextResponse.json(
        {
          message: CommonErrorException.NOT_FOUND.message,
          code: CommonErrorException.NOT_FOUND.code,
        },
        { status: CommonErrorException.NOT_FOUND.status },
      );
    }

    revalidateTag(orderTags.adminList);
    revalidateTag(orderTags.adminDetail(data._id));
    revalidateTag(dashboardTags.order);

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
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
