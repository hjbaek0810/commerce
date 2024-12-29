'use client';

import { useMemo } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import useAdminOrderDashboard from '@app/admin/AdminDashboard/Order/useAdminOrderDashboard';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { DashboardDateRangeType } from '@utils/constants/dashboard';
import { formatNumber } from '@utils/formatter/number';

import * as css from '../../adminHome.css';

import type { PieLabelRenderProps } from 'recharts';

const RADIAN = Math.PI / 180;

const AdminOrderDashboard = () => {
  const {
    statusList,
    totalPriceList,
    statusColorMap,
    searchOrderForm,
    startDate,
    endDate,
    totalAmountMessage,
    activeButton,
    handleStartDateChange,
    handleEndDateChange,
    handleResetButtonClick,
    handleDateFilterSelection,
    handleSearchButtonClick,
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
        <div className={css.searchForm}>
          <div
            className={sprinkles({
              display: 'flex',
              gap: 'spacing-004',
            })}
          >
            <Button
              fullWidth
              fill={activeButton('today')}
              size="small"
              onClick={() => handleDateFilterSelection('today')}
            >
              오늘
            </Button>
            <Button
              fullWidth
              fill={activeButton('thisMonth')}
              size="small"
              onClick={() => handleDateFilterSelection('thisMonth')}
            >
              이번 달
            </Button>
          </div>
          <div
            className={sprinkles({
              display: 'flex',
              gap: 'spacing-004',
            })}
          >
            <Button
              fullWidth
              fill={activeButton('7days')}
              size="small"
              onClick={() => handleDateFilterSelection('7days')}
            >
              7일전
            </Button>
            <Button
              fullWidth
              fill={activeButton('15days')}
              size="small"
              onClick={() => handleDateFilterSelection('15days')}
            >
              15일전
            </Button>
            <Button
              fullWidth
              fill={activeButton('30days')}
              size="small"
              onClick={() => handleDateFilterSelection('30days')}
            >
              30일전
            </Button>
          </div>

          <Rhf.Form
            {...searchOrderForm}
            onSubmit={handleSearchButtonClick}
            className={css.searchDateWrapper}
          >
            <div className={css.dateInputWrapper}>
              <Rhf.DateInput
                name="startDate"
                selectsStart
                onChange={handleStartDateChange}
                startDate={startDate}
                endDate={endDate}
              />
              <span
                className={sprinkles({
                  paddingX: 'spacing-004',
                })}
              >
                -
              </span>
              <Rhf.DateInput
                name="endDate"
                selectsEnd
                onChange={handleEndDateChange}
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </div>

            <Rhf.Radio
              name="dateRangeType"
              className={sprinkles({
                display: 'flex',
                gap: 'spacing-008',
                justifyContent: 'flex-end',
              })}
            >
              <Rhf.RadioOption value={DashboardDateRangeType.DAILY}>
                일 별
              </Rhf.RadioOption>
              <Rhf.RadioOption value={DashboardDateRangeType.MONTHLY}>
                월 별
              </Rhf.RadioOption>
            </Rhf.Radio>

            <div
              className={sprinkles({
                display: 'flex',
                gap: 'spacing-004',
                justifyContent: 'flex-end',
              })}
            >
              <Button type="submit">Search</Button>
              <Button onClick={handleResetButtonClick}>Reset</Button>
            </div>
          </Rhf.Form>
        </div>

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
                <Legend
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
