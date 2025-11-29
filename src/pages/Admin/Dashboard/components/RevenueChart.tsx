import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { RevenueChart as RevenueChartData } from '../types';

interface RevenueChartProps {
  data: RevenueChartData[];
  type?: 'bar' | 'line';
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, type = 'bar' }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.month}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Doanh thu: {formatCurrency(payload[0].value)}
            </p>
            {payload[1] && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Hoa hồng: {formatCurrency(payload[1].value)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Biểu đồ doanh thu và hoa hồng theo tháng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Doanh thu"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="commission"
                name="Hoa hồng"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: '#6b7280' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Doanh thu"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="commission"
                name="Hoa hồng"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
