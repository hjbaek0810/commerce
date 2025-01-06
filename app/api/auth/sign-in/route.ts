import * as bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import connectDB from '@api/config/connectDB';
import UserModel from '@api/models/user';

import type { SignInUser } from '@api/auth/sign-in/types/dto';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data: SignInUser = await req.json();

    const user = await UserModel.findOne({ loginId: data.loginId });

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const { password, ...userWithoutPassword } = user._doc;

      return NextResponse.json(userWithoutPassword, {
        status: 200,
      });
    }

    return NextResponse.json(null, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load categories.',
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
