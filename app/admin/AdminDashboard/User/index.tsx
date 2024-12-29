'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import useAdminUserDashboard from '@app/admin/AdminDashboard/User/useAdminUserDashboard';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { DashboardDateRangeType } from '@utils/constants/dashboard';
import { formatNumber } from '@utils/formatter/number';

import * as css from '../../adminHome.css';

const AdminUserDashboard = () => {
  const {
    userData,
    searchUserForm,
    startDate,
    endDate,
    totalUserCount,
    filteredTotalUserCount,
    activeButton,
    handleStartDateChange,
    handleEndDateChange,
    handleDateFilterSelection,
    handleSearchButtonClick,
    handleResetButtonClick,
  } = useAdminUserDashboard();

  return (
    <>
      <Title>유저 가입자 수 현황</Title>
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
            {...searchUserForm}
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

        <span className={css.totalUserText}>
          {`가입자 수 : ${formatNumber(filteredTotalUserCount)} / ${formatNumber(totalUserCount)}`}
        </span>
        <div
          className={sprinkles({
            height: 'sizing-480',
          })}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              barSize={50}
              data={userData}
              margin={{
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize="1.4rem" />
              <YAxis fontSize="1.4rem" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '1.2rem' }} />
              <Bar dataKey="google" stackId="a" fill="#8884d8" />
              <Bar dataKey="credentials" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AdminUserDashboard;
