import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { checkSession } from '@api/helper/session';
import UserModel from '@api/models/user';
import { UserRoleType } from '@utils/constants/user';

import type { AdminSearchUser } from '@api/admin/user/types/dto';
import type { UserLoginType } from '@utils/constants/user';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

enum AdminDashboardUserErrorType {
  DATE_RANGE_INVALID = 'A-DR-001',
}

const isValidDateRange = (start: string, end: string) => {
  const startD = new Date(start);
  const endD = new Date(end);

  if (startD > endD) {
    return false;
  }

  return true;
};

const setStartOfDay = (date: string) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);

  return d;
};

const setEndOfDay = (date: string) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);

  return d;
};

const getThirtyDaysAgo = () => {
  const today = new Date();
  today.setDate(today.getDate() - 30);

  return today.toISOString().split('T')[0];
};

type CustomDashboardUserType = {
  _id: string;
  loginTypes: {
    loginType: UserLoginType;
    user: { _id: string; name: string };
  }[];
};

export async function GET(req: NextRequest) {
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

    const { searchParams } = req.nextUrl;

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filters: FilterQuery<AdminSearchUser> = {
      role: { $ne: UserRoleType.ADMIN },
    };

    if (startDate && endDate) {
      if (!isValidDateRange) {
        return NextResponse.json(
          {
            message: 'Start date cannot be greater than end date.',
            code: AdminDashboardUserErrorType.DATE_RANGE_INVALID,
          },
          { status: 400 },
        );
      }

      filters.createdAt = {
        $gte: setStartOfDay(startDate),
        $lte: setEndOfDay(endDate),
      };
    } else if (startDate) {
      filters.createdAt = {
        $gte: setStartOfDay(startDate),
      };
    } else if (endDate) {
      filters.createdAt = {
        $lte: setEndOfDay(endDate),
      };
    } else {
      const defaultStartDate = getThirtyDaysAgo();

      filters.createdAt = {
        $gte: setStartOfDay(defaultStartDate),
      };
    }

    const users = await UserModel.aggregate<CustomDashboardUserType>([
      {
        $match: filters,
      },
      {
        $project: {
          createdAt: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          _id: 1,
          name: 1,
          loginType: 1,
        },
      },
      {
        $group: {
          _id: '$createdAt',
          loginTypes: {
            $push: {
              loginType: '$loginType',
              user: {
                _id: '$_id',
                name: '$name',
              },
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const result = users.map(dateGroup => {
      const groupedByLoginType: Record<
        UserLoginType,
        { _id: string; name: string }[]
      > = {
        GOOGLE: [],
        CREDENTIALS: [],
      };

      dateGroup.loginTypes.forEach(({ loginType, user }) => {
        if (groupedByLoginType[loginType]) {
          groupedByLoginType[loginType].push(user);
        }
      });

      return {
        date: dateGroup._id,
        loginTypes: groupedByLoginType,
      };
    });

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load dashboard users.',
      },
      { status: 500 },
    );
  }
}
