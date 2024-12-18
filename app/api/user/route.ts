import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import UserModel from '@api/models/user';

import type { CreateUser } from '@api/user/types/dto';
import type { NextRequest } from 'next/server';

enum UserErrorCode {
  USER_ALREADY_EXISTS = 'U-001',
  EMAIL_ALREADY_EXISTS = 'U-002',
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

    const { password, ...userWithoutPassword } = user._doc;

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