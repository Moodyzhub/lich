import { DashboardData, DashboardStats, RevenueChart, StudentActivity, UpcomingSession, CourseStats } from './types';

export const mockDashboardStats: DashboardStats = {
  totalCourses: 12,
  totalStudents: 245,
  totalEarnings: 125000000,
  monthlyEarnings: 18500000,
  averageRating: 4.7,
  totalBookings: 156,
  activePackages: 8,
  pendingBookings: 5,
};

export const mockRevenueChart: RevenueChart[] = [
  { month: 'T1', earnings: 8500000, bookings: 12 },
  { month: 'T2', earnings: 9200000, bookings: 14 },
  { month: 'T3', earnings: 11000000, bookings: 18 },
  { month: 'T4', earnings: 10500000, bookings: 15 },
  { month: 'T5', earnings: 13500000, bookings: 22 },
  { month: 'T6', earnings: 15000000, bookings: 25 },
  { month: 'T7', earnings: 12500000, bookings: 20 },
  { month: 'T8', earnings: 14000000, bookings: 23 },
  { month: 'T9', earnings: 16500000, bookings: 28 },
  { month: 'T10', earnings: 17500000, bookings: 30 },
  { month: 'T11', earnings: 18500000, bookings: 32 },
  { month: 'T12', earnings: 19000000, bookings: 35 },
];

export const mockRecentActivities: StudentActivity[] = [
  {
    studentId: '1',
    studentName: 'Nguyễn Văn A',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    action: 'Đăng ký khóa học',
    courseName: 'Tiếng Anh giao tiếp cơ bản',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '2',
    studentName: 'Trần Thị B',
    studentAvatar: 'https://i.pravatar.cc/150?img=2',
    action: 'Hoàn thành bài học 5',
    courseName: 'Tiếng Tây Ban Nha nâng cao',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '3',
    studentName: 'Lê Minh C',
    studentAvatar: 'https://i.pravatar.cc/150?img=3',
    action: 'Đánh giá 5 sao',
    courseName: 'Tiếng Pháp cơ bản',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '4',
    studentName: 'Phạm Thu D',
    studentAvatar: 'https://i.pravatar.cc/150?img=4',
    action: 'Đăng ký khóa học',
    courseName: 'Tiếng Nhật sơ cấp',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '5',
    studentName: 'Hoàng Anh E',
    studentAvatar: 'https://i.pravatar.cc/150?img=5',
    action: 'Hoàn thành khóa học',
    courseName: 'Tiếng Hàn trung cấp',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '6',
    studentName: 'Vũ Thị F',
    studentAvatar: 'https://i.pravatar.cc/150?img=6',
    action: 'Đánh giá 4 sao',
    courseName: 'Tiếng Trung giao tiếp',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '7',
    studentName: 'Đỗ Văn G',
    studentAvatar: 'https://i.pravatar.cc/150?img=7',
    action: 'Hoàn thành bài học 10',
    courseName: 'Tiếng Đức nâng cao',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: '8',
    studentName: 'Bùi Thị H',
    studentAvatar: 'https://i.pravatar.cc/150?img=8',
    action: 'Đăng ký gói học 1-1',
    courseName: 'Tiếng Ý cơ bản',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockUpcomingSessions: UpcomingSession[] = [
  {
    id: '1',
    studentName: 'Nguyễn Văn A',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    courseName: 'Tiếng Anh giao tiếp cơ bản',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    packageName: 'Gói 10 buổi',
  },
  {
    id: '2',
    studentName: 'Trần Thị B',
    studentAvatar: 'https://i.pravatar.cc/150?img=2',
    courseName: 'Tiếng Tây Ban Nha nâng cao',
    startTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
    packageName: 'Gói 5 buổi',
  },
  {
    id: '3',
    studentName: 'Lê Minh C',
    studentAvatar: 'https://i.pravatar.cc/150?img=3',
    courseName: 'Tiếng Pháp cơ bản',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    studentName: 'Phạm Thu D',
    studentAvatar: 'https://i.pravatar.cc/150?img=4',
    courseName: 'Tiếng Nhật sơ cấp',
    startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    packageName: 'Gói 15 buổi',
  },
  {
    id: '5',
    studentName: 'Hoàng Anh E',
    studentAvatar: 'https://i.pravatar.cc/150?img=5',
    courseName: 'Tiếng Hàn trung cấp',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
  },
];

export const mockTopCourses: CourseStats[] = [
  {
    courseId: '1',
    courseName: 'Tiếng Anh giao tiếp cơ bản',
    enrollments: 78,
    completionRate: 85,
    revenue: 35000000,
  },
  {
    courseId: '2',
    courseName: 'Tiếng Tây Ban Nha nâng cao',
    enrollments: 62,
    completionRate: 78,
    revenue: 28000000,
  },
  {
    courseId: '3',
    courseName: 'Tiếng Pháp cơ bản',
    enrollments: 45,
    completionRate: 92,
    revenue: 22000000,
  },
  {
    courseId: '4',
    courseName: 'Tiếng Nhật sơ cấp',
    enrollments: 38,
    completionRate: 88,
    revenue: 18500000,
  },
  {
    courseId: '5',
    courseName: 'Tiếng Hàn trung cấp',
    enrollments: 32,
    completionRate: 75,
    revenue: 15000000,
  },
];

export const mockDashboardData: DashboardData = {
  stats: mockDashboardStats,
  revenueChart: mockRevenueChart,
  recentActivities: mockRecentActivities,
  upcomingSessions: mockUpcomingSessions,
  topCourses: mockTopCourses,
};
