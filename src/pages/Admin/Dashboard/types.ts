export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  activeCourses: number;
  pendingCourses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingTutorApplications: number;
  pendingWithdrawals: number;
  totalBookings: number;
  activeUsers: number;
}

export interface RevenueChart {
  month: string;
  revenue: number;
  commission: number;
}

export interface UserGrowthChart {
  month: string;
  students: number;
  tutors: number;
}

export interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: 'student' | 'tutor';
  joinedAt: string;
}

export interface RecentCourse {
  id: string;
  title: string;
  tutorName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface PlatformActivity {
  id: string;
  type: 'user_registered' | 'course_created' | 'booking_made' | 'payment_completed' | 'tutor_approved';
  description: string;
  timestamp: string;
  user?: string;
}

export interface TopTutor {
  id: string;
  fullName: string;
  avatar: string;
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  rating: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  revenueChart: RevenueChart[];
  userGrowthChart: UserGrowthChart[];
  recentUsers: RecentUser[];
  recentCourses: RecentCourse[];
  platformActivities: PlatformActivity[];
  topTutors: TopTutor[];
}
