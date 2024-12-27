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

import * as css from '../../adminHome.css';

const AdminUserDashboard = () => {
  const {
    user,
    searchUserForm,
    startDate,
    endDate,
    activeButton,
    handleStartDateChange,
    handleEndDateChange,
    handleDateFilterSelection,
    handleSearchButtonClick,
    handleResetButtonClick,
  } = useAdminUserDashboard();

  const data = user.map(item => ({
    name: item.date,
    google: item.loginTypes.GOOGLE.length,
    credentials: item.loginTypes.CREDENTIALS.length,
  }));

  return (
    <>
      <Title>유저 가입자 수 현황</Title>
      <div className={css.userFormWrapper}>
        <div className={css.searchUserDateButtonWrapper}>
          <Button
            fill={activeButton(7)}
            size="small"
            onClick={() => handleDateFilterSelection(7)}
          >
            7일전
          </Button>
          <Button
            fill={activeButton(15)}
            size="small"
            onClick={() => handleDateFilterSelection(15)}
          >
            15일전
          </Button>
          <Button
            fill={activeButton(30)}
            size="small"
            onClick={() => handleDateFilterSelection(30)}
          >
            30일전
          </Button>
        </div>
        <Rhf.Form
          {...searchUserForm}
          onSubmit={handleSearchButtonClick}
          className={css.dateInputWrapper}
        >
          <Rhf.DateInput
            name="startDate"
            selectsStart
            onChange={handleStartDateChange}
            startDate={startDate}
            endDate={endDate}
          />
          <span>-</span>
          <Rhf.DateInput
            name="endDate"
            selectsEnd
            onChange={handleEndDateChange}
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
          <Button type="submit">Search</Button>
          <Button onClick={handleResetButtonClick}>Reset</Button>
        </Rhf.Form>
      </div>
      <div className={css.userDashboardWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="google" stackId="a" fill="#8884d8" />
            <Bar dataKey="credentials" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AdminUserDashboard;
