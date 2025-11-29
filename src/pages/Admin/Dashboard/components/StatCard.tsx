import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  description,
  color = 'bg-blue-600',
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={`${color} p-2 rounded-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trendUp ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              so với tháng trước
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
