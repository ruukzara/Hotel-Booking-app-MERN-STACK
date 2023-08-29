import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LineChartComp = () => {
  const chartData = [
    { date: '2023-01-01', userCount: 102, hotelCount: 44 },
    { date: '2023-01-02', userCount: 65, hotelCount: 78 },
    { date: '2023-01-03', userCount: 1281, hotelCount: 92 },
    { date: '2023-01-04', userCount: 201, hotelCount: 192 },
    { date: '2023-01-05', userCount: 881, hotelCount: 902 },
    { date: '2023-01-06', userCount: 128, hotelCount: 8},
    // Add more data points here
  ];

  return (
    <div className='chart-container'>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart width={500} height={300} data={chartData} className='linechart'>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="monotone" dataKey="userCount" name="Users Logged In" stroke="rgba(75, 192, 192, 1)" />
          <Line type="monotone" dataKey="hotelCount" name="Hotels Booked" stroke="rgba(255, 99, 132, 1)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


