import * as bcrypt from 'bcryptjs';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import UserModel from '@api/models/user';
import { dashboardTags } from '@services/queries/dashboard/keys';
import { userTags } from '@services/queries/user/keys';

import type { UserModelType } from '@api/models/user';
import type { CreateUser, UpdateUser } from '@api/user/types/dto';
import type { NextRequest } from 'next/server';

enum UserErrorCode {
  USER_ALREADY_EXISTS = 'U-001',
  EMAIL_ALREADY_EXISTS = 'U-002',
  USER_NOT_FOUND = 'U-003',
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

    const user = await UserModel.findById(sessionCheck.userId)
      .select('-password')
      .lean<UserModelType>();

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          code: UserErrorCode.USER_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    const { contactEmail, ...restUserInfo } = user;

    return NextResponse.json(
      { email: contactEmail, ...restUserInfo },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load user.',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data: CreateUser = await req.json();

    const dbUserByLoginId = await UserModel.findOne({ loginId: data.loginId });

    if (dbUserByLoginId) {
      return NextResponse.json(
        {
          message: '이미 존재한 아이디입니다.',
          code: UserErrorCode.USER_ALREADY_EXISTS,
        },
        { status: 409 },
      );
    }

    const { email, ...restData } = data;

    const user = await UserModel.create({
      ...restData,
      contactEmail: data.email,
      password: await bcrypt.hash(data.password, 10),
    });

    const { password, contactEmail, ...restUserInfo } = user._doc;

    revalidateTag(userTags.adminList);
    revalidateTag(dashboardTags.user);

    return NextResponse.json(
      {
        ...restUserInfo,
        email: contactEmail,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to sign-up.',
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const data: UpdateUser = await req.json();
    const { email, ...restData } = data;

    const updatedUser = await UserModel.findByIdAndUpdate(sessionCheck.userId, {
      $set: { ...restData, ...(email && { contactEmail: email }) },
    });

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: 'User not found',
          code: UserErrorCode.USER_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    revalidateTag(userTags.adminList);
    // revalidateTag(userTags.adminDetail(sessionCheck.userId));

    return NextResponse.json({
      message: 'success',
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to sign-up.',
      },
      { status: 500 },
    );
  }
}
