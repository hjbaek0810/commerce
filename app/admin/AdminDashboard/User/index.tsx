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

import DashboardSearchForm from '@app/admin/AdminDashboard/SearchForm';
import useAdminUserDashboard from '@app/admin/AdminDashboard/User/useAdminUserDashboard';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { formatNumber } from '@utils/formatter/number';

import * as css from '../../adminHome.css';

import type { SearchAdminUserDashboard } from '@api/admin/dashboard/types/dto';

const AdminUserDashboard = () => {
  const { userData, totalUserCount, filteredTotalUserCount, searchFormProps } =
    useAdminUserDashboard();

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
        <DashboardSearchForm<SearchAdminUserDashboard> {...searchFormProps} />

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
