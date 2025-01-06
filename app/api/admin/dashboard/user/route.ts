import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/route';
import connectDB from '@api/config/connectDB';
import { CommonErrorException } from '@api/exception';
import {
  isValidDateRange,
  setEndOfDay,
  setEndOfMonth,
  setStartOfDay,
  setStartOfMonth,
} from '@api/helper/filter';
import { checkSession } from '@api/helper/session';
import UserModel from '@api/models/user';
import { DashboardDateRangeType } from '@utils/constants/dashboard';
import { UserRoleType } from '@utils/constants/user';

import type { SearchAdminUserDashboard } from '@api/admin/dashboard/types/dto';
import type { UserLoginType } from '@utils/constants/user';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

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
    const dateRangeType = searchParams.get('dateRangeType');

    const filters: FilterQuery<SearchAdminUserDashboard> = {
      role: { $ne: UserRoleType.ADMIN },
    };

    if (startDate && endDate) {
      if (!isValidDateRange(startDate, endDate)) {
        return NextResponse.json(
          {
            message: CommonErrorException.DATE_RANGE_INVALID.message,
            code: CommonErrorException.DATE_RANGE_INVALID.code,
          },
          { status: CommonErrorException.DATE_RANGE_INVALID.status },
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
      // 이번달로 기본설정
      filters.createdAt = {
        $gte: setStartOfMonth(),
        $lte: setEndOfMonth(),
      };
    }

    let groupByDateField;

    if (dateRangeType === DashboardDateRangeType.DAILY) {
      groupByDateField = {
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // 일별로 그룹화
      };
    } else {
      groupByDateField = {
        $dateToString: { format: '%Y-%m', date: '$createdAt' }, // 월별로 그룹화
      };
    }

    const users = await UserModel.aggregate<CustomDashboardUserType>([
      {
        $match: filters,
      },
      {
        $project: {
          createdAt: groupByDateField,
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

    const totalUserCount = await UserModel.countDocuments({
      role: { $ne: UserRoleType.ADMIN },
    });

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

    return NextResponse.json(
      {
        items: result || [],
        totalUserCount: totalUserCount || 0,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load dashboard users.',
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
