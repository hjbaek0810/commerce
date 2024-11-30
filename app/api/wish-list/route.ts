import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import ProductModel from '@api/models/product';
import WishListModel from '@api/models/wishList';
import { WishListVO } from '@api/wish-list/types/vo';

import type { UpdateWishItem } from '@api/wish-list/types/dto';
import type { NextRequest } from 'next/server';

enum WishListErrorType {
  WISH_LIST_NOT_FOUND = 'WI-001',
}

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (session === null || !userId) {
      return NextResponse.json({
        status: 200,
        message: 'No active session or user ID not found.',
      });
    }

    const wishList = await WishListModel.findById(userId).populate({
      path: 'productIds',
      model: ProductModel,
      select: '_id name images price salePrice',
    });
    console.log('get wish', wishList);

    const { productIds, ...rest } = wishList?._doc || {};

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

    return NextResponse.json({
      message: 'Failed to load wish list.',
      code: WishListErrorType.WISH_LIST_NOT_FOUND,
      status: 400,
    });
  }
}

export async function POST(req: NextRequest) {
  const data: UpdateWishItem = await req.json();

  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (session === null || !userId) {
      return NextResponse.json({
        status: 200,
        message: 'No active session or user ID not found.',
      });
    }
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
      { status: 400 },
    );
  }
}
