import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import CartModel from '@api/models/cart';
import OrderModel from '@api/models/order';
import ProductModel from '@api/models/product';
import { ProductStatusType } from '@utils/constants/product';

import type { CreateOrder, UpdateOrder } from '@api/order/types/dto';
import type { OrderListVO, OrderProductVO } from '@api/order/types/vo';
import type { NextRequest } from 'next/server';

enum OrderListErrorType {
  ORDER_LIST_NOT_FOUND = 'OI-001',
}

type ProductItemType = {
  productId: OrderProductVO;
  quantity: number;
  price: number;
};

export async function GET() {
  try {
    await connectDB();
    const sessionCheck = await checkSession(authOptions);

    if (!sessionCheck.isValid) {
      return NextResponse.json({
        message: sessionCheck.message,
        code: sessionCheck.code,
        status: sessionCheck.status,
      });
    }

    const { userId } = sessionCheck;

    const orderList = await OrderModel.find({ userId })
      .populate({
        path: 'productIds.productId',
        model: ProductModel,
        select: '_id name images',
      })
      .sort({ createdAt: -1 });

    const ordersDoc = orderList.map(({ _doc }) => _doc);

    const orders: OrderListVO[] = ordersDoc.map(
      ({ _id, productIds, ...order }) => ({
        _id: _id.toString(),
        userId,
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

    return NextResponse.json(orders, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      message: 'Failed to load order list.',
      code: OrderListErrorType.ORDER_LIST_NOT_FOUND,
      status: 400,
    });
  }
}

export async function POST(req: NextRequest) {
  const data: CreateOrder = await req.json();

  try {
    await connectDB();
    const sessionCheck = await checkSession(authOptions);

    if (!sessionCheck.isValid) {
      return NextResponse.json({
        message: sessionCheck.message,
        code: sessionCheck.code,
        status: sessionCheck.status,
      });
    }

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

    for (const item of products) {
      const product = await ProductModel.findById(item._id);

      if (!product) {
        throw new Error(`Product with ID ${item._id} not found.`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }

      product.quantity -= item.quantity;

      if (product.quantity === 0) {
        product.status = ProductStatusType.STOPPED;
      }

      await product.save();
    }

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
      { status: 400 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const data: UpdateOrder = await req.json();

  try {
    await connectDB();
    const sessionCheck = await checkSession(authOptions);

    if (!sessionCheck.isValid) {
      return NextResponse.json({
        message: sessionCheck.message,
        code: sessionCheck.code,
        status: sessionCheck.status,
      });
    }

    const { userId } = sessionCheck;

    const { _id, status, paymentType } = data;

    await OrderModel.updateOne(
      { _id, userId },
      {
        $set: {
          status,
          ...(paymentType && { paymentType }),
        },
      },
    );

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
      { status: 400 },
    );
  }
}
