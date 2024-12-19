import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import UserModel from '@api/models/user';

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

    const user = await UserModel.findById(
      sessionCheck.userId,
    ).lean<UserModelType>();

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          code: UserErrorCode.USER_NOT_FOUND,
        },
        { status: 404 },
      );
    }

    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, {
      status: 200,
    });
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

    const dbUserByEmail = await UserModel.findOne({ email: data.email });
    if (dbUserByEmail) {
      return NextResponse.json(
        {
          message: '이미 존재한 이메일입니다.',
          code: UserErrorCode.EMAIL_ALREADY_EXISTS,
        },
        { status: 409 },
      );
    }

    const user = await UserModel.create({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });

    const { password, ...userWithoutPassword } = user.lean();

    return NextResponse.json(userWithoutPassword, {
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
