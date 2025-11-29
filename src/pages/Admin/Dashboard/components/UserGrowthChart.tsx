import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { UserGrowthChart as UserGrowthData } from '../types';

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.month}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Học viên mới: {payload[0].value}
            </p>
            {payload[1] && (
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Tutor mới: {payload[1].value}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tăng trưởng người dùng theo tháng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTutors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="month" className="text-xs" tick={{ fill: '#6b7280' }} />
            <YAxis className="text-xs" tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="students"
              name="Học viên"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorStudents)"
            />
            <Area
              type="monotone"
              dataKey="tutors"
              name="Tutor"
              stroke="#f97316"
              fillOpacity={1}
              fill="url(#colorTutors)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
