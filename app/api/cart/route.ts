import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import CartModel from '@api/models/cart';
import ProductModel from '@api/models/product';

import type { DeleteCartItems, UpdateCartItem } from '@api/cart/types/dto';
import type { CartModelType } from '@api/models/cart';
import type { ProductModelType } from '@api/models/product';
import type { Schema } from 'mongoose';
import type { NextRequest } from 'next/server';

enum CartListErrorType {
  CART_LIST_NOT_FOUND = 'CI-001',
  CART_PRODUCT_NOT_FOUND = 'CI-002',
}

export async function GET() {
  try {
    await connectDB();
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

    const { userId } = sessionCheck;

    const cartList = await CartModel.findById(userId)
      .populate({
        path: 'productIds.productId',
        model: ProductModel,
        select: '_id name images price salePrice quantity status',
      })
      .lean<CartModelType>();

    if (!cartList) {
      return NextResponse.json(
        {
          items: [],
        },
        {
          status: 200,
        },
      );
    }

    const { productIds, ...rest } = cartList;

    const items = productIds
      ?.map(item => ({
        product: item.productId || null,
        quantity: item.quantity,
        addedAt: item.addedAt,
      }))
      .sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      );

    return NextResponse.json(
      {
        items,
        ...rest,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load cart list.',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const data: UpdateCartItem = await req.json();

  try {
    await connectDB();
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

    const { userId } = sessionCheck;

    let cartList = await CartModel.findById(userId);

    if (!cartList) {
      cartList = new CartModel({
        _id: userId,
        productIds: [],
      });
    }

    const product = await ProductModel.findById(
      data.productId,
    ).lean<ProductModelType>();
    if (!product) {
      return NextResponse.json(
        {
          message: 'Product not found.',
          code: CartListErrorType.CART_PRODUCT_NOT_FOUND,
        },
        { status: 400 },
      );
    }

    const existingCartIndex = cartList.productIds.findIndex(
      (item: { productId: Schema.Types.ObjectId }) =>
        item.productId.toString() === data.productId,
    );

    if (existingCartIndex === -1) {
      cartList.productIds.push({
        productId: data.productId,
        quantity: data.quantity,
        addedAt: new Date(),
      });
    } else {
      const currentQuantityInCart =
        cartList.productIds[existingCartIndex].quantity;

      if (currentQuantityInCart + data.quantity <= product.quantity) {
        cartList.productIds[existingCartIndex].quantity += data.quantity;
      }

      cartList.productIds[existingCartIndex].addedAt = new Date();
    }

    await cartList.save();

    return NextResponse.json({
      message: 'success',
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to update cart list.',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { productIds }: DeleteCartItems = await req.json();

  try {
    await connectDB();

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

    const { userId } = sessionCheck;

    const cartList = await CartModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { productIds: { productId: { $in: productIds } } } },
      { new: true },
    );

    if (!cartList) {
      return NextResponse.json(
        {
          message: 'Cart not found.',
          code: CartListErrorType.CART_LIST_NOT_FOUND,
        },
        { status: 400 },
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
        message: 'Failed to delete cart list.',
      },
      { status: 500 },
    );
  }
}
