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
