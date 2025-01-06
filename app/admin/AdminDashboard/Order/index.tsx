'use client';

import { useMemo } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  isLegend,
} from 'recharts';

import useAdminOrderDashboard from '@app/admin/AdminDashboard/Order/useAdminOrderDashboard';
import DashboardSearchForm from '@app/admin/AdminDashboard/SearchForm';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { formatNumber } from '@utils/formatter/number';

import * as css from '../../adminHome.css';

import type { SearchAdminOrderDashboard } from '@api/admin/dashboard/types/dto';
import type { PieLabelRenderProps } from 'recharts';

const RADIAN = Math.PI / 180;

const AdminOrderDashboard = () => {
  const {
    statusList,
    totalPriceList,
    statusColorMap,
    totalAmountMessage,
    searchFormProps,
  } = useAdminOrderDashboard();

  const renderCustomizedLabel = useMemo(
    () =>
      ({
        name,
        cx = 0,
        cy = 0,
        midAngle = 0,
        innerRadius = 0,
        outerRadius = 0,
        percent = 0,
      }: PieLabelRenderProps) => {
        if (percent === 0) return null;

        const radius =
          Number(innerRadius) +
          (Number(outerRadius) - Number(innerRadius)) * 0.5;
        const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
        const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

        return (
          <text
            className={sprinkles({
              fontWeight: 'bold',
              fontSize: 'font-size-012',
            })}
            x={x}
            y={y}
            fill="white"
            textAnchor={x > Number(cx) ? 'start' : 'end'}
            dominantBaseline="central"
          >
            {name === 'none' ? 'no data' : `${(percent * 100).toFixed(0)}%`}
          </text>
        );
      },
    [],
  );

  return (
    <>
      <Title>주문 현황</Title>
      <div
        className={sprinkles({
          display: 'flex',
          flexDirection: 'column',
          gap: 'spacing-032',
        })}
      >
        <DashboardSearchForm<SearchAdminOrderDashboard> {...searchFormProps} />
        <div
          className={sprinkles({
            display: 'flex',
            gap: 'spacing-008',
          })}
        >
          <div className={css.totalAmountBox}>{totalAmountMessage}</div>
          <div
            className={sprinkles({
              width: 'sizing-half',
              height: 'sizing-256',
            })}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <isLegend
                  wrapperStyle={{ fontSize: '1.2rem' }}
                  layout="vertical"
                  verticalAlign="top"
                  align="left"
                />
                <Pie
                  key={totalAmountMessage}
                  data={statusList}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#ffffff"
                  dataKey="value"
                >
                  {statusList.map(entry => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={statusColorMap[entry.status] || '#b8b8b8'}
                    />
                  ))}
                </Pie>
                {!statusList.some(item => item.name === 'none') && <Tooltip />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div
          className={sprinkles({
            height: 'sizing-480',
          })}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={totalPriceList}
              margin={{ top: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis fontSize="1.4rem" dataKey="name" />
              <YAxis
                fontSize="1.4rem"
                tickFormatter={tick => formatNumber(tick) + '원'}
              />
              <Bar
                key={totalAmountMessage}
                dataKey="price"
                fill="#3892ed"
                barSize={30}
                label={{
                  position: 'top',
                  offset: 8,
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  formatter: (value: number) => formatNumber(value),
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDashboard;
