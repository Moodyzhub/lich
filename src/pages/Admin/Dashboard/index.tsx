import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  BookOpen,
  FileCheck,
  DollarSign,
  UserCheck,
  AlertCircle,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { fetchAdminDashboardData } from './api';
import { AdminDashboardData } from './types';
import {
  StatCard,
  RevenueChart,
  UserGrowthChart,
  RecentUsers,
  RecentCourses,
  PlatformActivities,
  TopTutors,
} from './components';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<AdminDashboardData>({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboardData,
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
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
  const userGrowthChart = dashboardData?.userGrowthChart || [];
  const recentUsers = dashboardData?.recentUsers || [];
  const recentCourses = dashboardData?.recentCourses || [];
  const platformActivities = dashboardData?.platformActivities || [];
  const topTutors = dashboardData?.topTutors || [];

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Dashboard Quản Trị</h1>
        <p className="text-blue-100 text-lg">
          Chào mừng đến với hệ thống quản trị LinguaHub
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={formatNumber(stats?.totalUsers || 0)}
          icon={Users}
          color="bg-blue-600"
          description={`${formatNumber(stats?.totalStudents || 0)} học viên, ${formatNumber(stats?.totalTutors || 0)} tutor`}
        />
        <StatCard
          title="Tổng khóa học"
          value={formatNumber(stats?.totalCourses || 0)}
          icon={BookOpen}
          color="bg-green-600"
          description={`${formatNumber(stats?.activeCourses || 0)} đang hoạt động`}
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          icon={DollarSign}
          color="bg-emerald-600"
          description="Thu nhập tháng này"
        />
        <StatCard
          title="Khóa học chờ duyệt"
          value={formatNumber(stats?.pendingCourses || 0)}
          icon={FileCheck}
          color="bg-yellow-600"
          description="Cần xem xét"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={TrendingUp}
          color="bg-teal-600"
          description="Tổng thu nhập hệ thống"
        />
        <StatCard
          title="Đơn tutor chờ duyệt"
          value={formatNumber(stats?.pendingTutorApplications || 0)}
          icon={UserCheck}
          color="bg-orange-600"
          description="Đơn đăng ký làm tutor"
        />
        <StatCard
          title="Yêu cầu rút tiền"
          value={formatNumber(stats?.pendingWithdrawals || 0)}
          icon={AlertCircle}
          color="bg-red-600"
          description="Chờ xử lý"
        />
        <StatCard
          title="Tổng lượt đặt lịch"
          value={formatNumber(stats?.totalBookings || 0)}
          icon={Calendar}
          color="bg-violet-600"
          description={`${formatNumber(stats?.activeUsers || 0)} người dùng hoạt động`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueChart} type={chartType} />
        <UserGrowthChart data={userGrowthChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsers users={recentUsers} />
        <RecentCourses courses={recentCourses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformActivities activities={platformActivities} />
        <TopTutors tutors={topTutors} />
      </div>
    </div>
  );
};

export default AdminDashboard;
