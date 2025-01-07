import { NextResponse } from 'next/server';

import { authOptions } from '@api/auth/[...nextauth]/authOptions';
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
import OrderModel from '@api/models/order';
import { DashboardDateRangeType } from '@utils/constants/dashboard';
import { OrderStatus } from '@utils/constants/order';
import { UserRoleType } from '@utils/constants/user';

import type { SearchAdminOrderDashboard } from '@api/admin/dashboard/types/dto';
import type { FilterQuery } from 'mongoose';
import type { NextRequest } from 'next/server';

const EXCLUDED_ORDER_STATUSES = [
  OrderStatus.ORDER_CANCELLED,
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.REFUND_PENDING,
  OrderStatus.REFUND_COMPLETED,
  OrderStatus.RETURN_COMPLETED,
  OrderStatus.RETURN_PENDING,
];

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

    const filters: FilterQuery<SearchAdminOrderDashboard> = {
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

    const orders = await OrderModel.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productIds.productId',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $group: {
          _id: null,
          statusItems: { $push: { status: '$status', count: '$count' } },
        },
      },
      {
        $project: {
          _id: 0,
          statusItems: 1,
        },
      },
    ]);

    const dateGroupedOrders = await OrderModel.aggregate([
      {
        $match: filters,
      },
      {
        $addFields: {
          totalPrice: {
            $cond: {
              if: {
                $in: ['$status', EXCLUDED_ORDER_STATUSES],
              },
              then: 0,
              else: {
                $sum: {
                  $map: {
                    input: '$productIds',
                    as: 'product',
                    in: {
                      $multiply: ['$$product.price', '$$product.quantity'],
                    },
                  },
                },
              },
            },
          },
          date: groupByDateField,
        },
      },
      {
        $group: {
          _id: '$date',
          totalPrice: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalPrice: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $group: {
          _id: null,
          dateItems: { $push: { date: '$date', totalPrice: '$totalPrice' } },
        },
      },
      {
        $project: {
          _id: 0,
          dateItems: 1,
        },
      },
    ]);

    if (orders && orders[0] && dateGroupedOrders && dateGroupedOrders[0]) {
      const result = {
        ...orders[0],
        ...dateGroupedOrders[0],
      };

      return NextResponse.json(result, {
        status: 200,
      });
    }

    return NextResponse.json(
      {
        statusItems: [],
        dateItems: [],
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Failed to load dashboard orders.',
      },
      { status: CommonErrorException.UNKNOWN_ERROR.status },
    );
  }
}
