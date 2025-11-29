import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Calendar,
  Package,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from './api';
import { DashboardData } from './types';
import { useUserInfo } from '@/hooks/useUserInfo';
import {
  StatCard,
  RevenueChart,
  RecentActivities,
  UpcomingSessions,
  TopCourses,
  QuickActions,
} from './components';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const TutorDashboard: React.FC = () => {
  const { userInfo } = useUserInfo();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ['tutor-dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const revenueChart = dashboardData?.revenueChart || [];
  const recentActivities = dashboardData?.recentActivities || [];
  const upcomingSessions = dashboardData?.upcomingSessions || [];
  const topCourses = dashboardData?.topCourses || [];

  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return { trend: '', trendUp: true };
    const change = ((current - previous) / previous) * 100;
    const trendUp = change >= 0;
    const trendText = `${trendUp ? '+' : ''}${change.toFixed(1)}%`;
    return { trend: trendText, trendUp };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-3">
          Chào mừng trở lại, {userInfo?.fullName || userInfo?.username}!
        </h1>
        <p className="text-blue-100 text-lg">
          Đây là tổng quan về hoạt động giảng dạy của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng khóa học"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          description="Khóa học đã tạo"
        />
        <StatCard
          title="Tổng học viên"
          value={stats?.totalStudents || 0}
          icon={Users}
          description="Học viên đang học"
        />
        <StatCard
          title="Thu nhập tháng"
          value={formatCurrency(stats?.monthlyEarnings || 0)}
          icon={DollarSign}
          description="Thu nhập tháng này"
        />
        <StatCard
          title="Đánh giá trung bình"
          value={stats?.averageRating?.toFixed(1) || '0.0'}
          icon={Star}
          description="Đánh giá từ học viên"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng thu nhập"
          value={formatCurrency(stats?.totalEarnings || 0)}
          icon={TrendingUp}
          description="Tổng thu nhập tích lũy"
        />
        <StatCard
          title="Lượt đặt lịch"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          description="Tổng số lượt đặt"
        />
        <StatCard
          title="Gói dịch vụ"
          value={stats?.activePackages || 0}
          icon={Package}
          description="Gói đang hoạt động"
        />
        <StatCard
          title="Chờ xác nhận"
          value={stats?.pendingBookings || 0}
          icon={AlertCircle}
          description="Lịch chờ xác nhận"
        />
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Biểu đồ cột
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Biểu đồ đường
          </button>
        </div>
      </div>

      <RevenueChart data={revenueChart} type={chartType} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={recentActivities} />
        <UpcomingSessions sessions={upcomingSessions} />
      </div>

      <TopCourses courses={topCourses} />

      <QuickActions />
    </div>
  );
};

export default TutorDashboard;
