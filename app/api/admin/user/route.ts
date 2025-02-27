import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/authOptions';
import connectDB from '@api/config/connectDB';
import { CommonErrorException } from '@api/exception';
import {
  isValidDateRange,
  setEndOfDay,
  setStartOfDay,
  shouldFilterKey,
} from '@api/helper/filter';
import { checkSession } from '@api/helper/session';
import UserModel from '@api/models/user';
import { UserRoleType, UserSortType } from '@utils/constants/user';

import type { AdminSearchUser } from '@api/admin/user/types/dto';
import type { UserModelType } from '@api/models/user';
import type { SortCriteria } from '@api/types';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

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

    const pageNumber = Number(searchParams.get('page'));
    const limitNumber = Number(searchParams.get('limit'));
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const sort = searchParams.get('sort') || UserSortType.NAME_ASC;

    const filters: FilterQuery<AdminSearchUser> = {
      role: { $ne: UserRoleType.ADMIN },
    };

    searchParams.forEach((value, key) => {
      if (shouldFilterKey(key, value, ['startDate', 'endDate'])) {
        switch (key) {
          case 'name':
            filters[key] = { $regex: `.*${value}.*`, $options: 'i' };
            break;
          case 'loginId':
            filters[key] = { $regex: `.*${value}.*` };
            break;
          case 'email':
            filters['contactEmail'] = { $regex: `.*${value}.*` };
            break;
          case 'telephone':
            filters[key] = { $regex: `^${value}` };
            break;
          default:
            filters[key] = value;
            break;
        }
      }
    });

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
    }

    let sortCriteria: SortCriteria = { name: 1 };

    switch (sort) {
      case UserSortType.NAME_ASC:
        sortCriteria = { name: 1 };
        break;
      case UserSortType.NAME_DESC:
        sortCriteria = { name: -1 };
        break;
    }

    const users = await UserModel.find(filters)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .select('-password -role')
      .sort(sortCriteria)
      .lean<UserModelType[]>();

    const updatedUsers = users.map(({ contactEmail, ...user }) => ({
      ...user,
      email: contactEmail,
    }));

    const count = await UserModel.find(filters).countDocuments();

    const response = {
      users: updatedUsers,
      currentPage: pageNumber,
      currentLimit: limitNumber,
      totalCount: count,
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load users.',
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
