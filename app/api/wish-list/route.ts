import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import ProductModel from '@api/models/product';
import WishListModel from '@api/models/wishList';

import type { WishListModelType } from '@api/models/wishList';
import type { DeleteWishItem, UpdateWishItem } from '@api/wish-list/types/dto';
import type { NextRequest } from 'next/server';

enum WishListErrorType {
  WISH_LIST_NOT_FOUND = 'WI-001',
}

export async function GET() {
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

    const wishList = await WishListModel.findById(userId)
      .populate({
        path: 'productIds',
        model: ProductModel,
        select: '_id name images price salePrice',
      })
      .lean<WishListModelType>();

    const { productIds, ...rest } = wishList || {};

    return NextResponse.json(
      {
        items: productIds || [],
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
        message: 'Failed to load wish list.',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const data: UpdateWishItem = await req.json();

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

    let wishList = await WishListModel.findById(userId);

    if (!wishList) {
      wishList = new WishListModel({
        _id: userId,
        productIds: [],
      });
    }

    const isProductInWishList = wishList?.productIds?.includes(data.productId);
    if (isProductInWishList) {
      wishList.productIds = wishList.productIds.filter(
        (id: string) => id.toString() !== data.productId,
      );
    } else {
      wishList.productIds.push(data.productId);
    }

    await wishList.save();

    return NextResponse.json({
      message: 'success',
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: `Failed to update wish list.`,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { productId }: DeleteWishItem = await req.json();

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

    const wishList = await WishListModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { productIds: productId } },
      { new: true },
    );

    if (!wishList) {
      return NextResponse.json(
        {
          message: 'Wish List Not Found.',
          code: WishListErrorType.WISH_LIST_NOT_FOUND,
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
        message: `Failed to delete wish list.`,
      },
      { status: 500 },
    );
  }
}
