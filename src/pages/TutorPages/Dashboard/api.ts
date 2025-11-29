import api from '@/config/axiosConfig';

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  monthlyEarnings: number;
  averageRating: number;
  totalBookings: number;
  activePackages: number;
  pendingBookings: number;
}

export interface RevenueChart {
  month: string;
  earnings: number;
  bookings: number;
}

export interface StudentActivity {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  action: string;
  courseName: string;
  timestamp: string;
}

export interface UpcomingSession {
  id: string;
  studentName: string;
  studentAvatar: string;
  courseName: string;
  startTime: string;
  endTime: string;
  packageName?: string;
}

export interface CourseStats {
  courseId: string;
  courseName: string;
  enrollments: number;
  completionRate: number;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: RevenueChart[];
  recentActivities: StudentActivity[];
  upcomingSessions: UpcomingSession[];
  topCourses: CourseStats[];
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await api.get('/tutor/dashboard');
  return response.data.result;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/tutor/dashboard/stats');
  return response.data.result;
};

export const fetchRevenueChart = async (year?: number): Promise<RevenueChart[]> => {
  const response = await api.get('/tutor/dashboard/revenue-chart', {
    params: { year: year || new Date().getFullYear() }
  });
  return response.data.result;
};

export const fetchRecentActivities = async (limit = 10): Promise<StudentActivity[]> => {
  const response = await api.get('/tutor/dashboard/activities', {
    params: { limit }
  });
  return response.data.result;
};

export const fetchUpcomingSessions = async (limit = 10): Promise<UpcomingSession[]> => {
  const response = await api.get('/tutor/dashboard/upcoming-sessions', {
    params: { limit }
  });
  return response.data.result;
};

export const fetchTopCourses = async (limit = 5): Promise<CourseStats[]> => {
  const response = await api.get('/tutor/dashboard/top-courses', {
    params: { limit }
  });
  return response.data.result;
};
