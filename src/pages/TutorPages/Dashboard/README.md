# Tutor Dashboard

Trang dashboard cho tutor với các chức năng thống kê, biểu đồ và quản lý.

## Các tính năng

### 1. Thống kê tổng quan (Stats Cards)
- **Tổng khóa học**: Số lượng khóa học tutor đã tạo
- **Tổng học viên**: Số lượng học viên đang học
- **Thu nhập tháng**: Thu nhập trong tháng hiện tại
- **Đánh giá trung bình**: Đánh giá trung bình từ học viên
- **Tổng thu nhập**: Tổng thu nhập tích lũy
- **Lượt đặt lịch**: Tổng số lượt đặt lịch
- **Gói dịch vụ**: Số lượng gói đang hoạt động
- **Chờ xác nhận**: Số lượng lịch chờ xác nhận

### 2. Biểu đồ doanh thu (Revenue Chart)
- Hiển thị doanh thu và lượt đặt theo 12 tháng
- Hỗ trợ 2 loại biểu đồ: cột (bar) và đường (line)
- Tooltip hiển thị chi tiết khi hover

### 3. Hoạt động gần đây (Recent Activities)
- Hiển thị các hoạt động mới nhất của học viên
- Bao gồm: đăng ký khóa học, hoàn thành bài học, đánh giá
- Hiển thị thời gian tương đối (vd: "2 giờ trước")

### 4. Buổi học sắp tới (Upcoming Sessions)
- Danh sách các buổi học 1-1 sắp diễn ra
- Hiển thị thông tin học viên, khóa học, thời gian
- Phân biệt "Hôm nay", "Ngày mai"

### 5. Khóa học hàng đầu (Top Courses)
- Top 5 khóa học có hiệu suất tốt nhất
- Hiển thị số học viên, tỷ lệ hoàn thành, doanh thu
- Progress bar cho tỷ lệ hoàn thành

### 6. Thao tác nhanh (Quick Actions)
- Các nút truy cập nhanh đến:
  - Tạo khóa học mới
  - Quản lý lịch
  - Gói dịch vụ
  - Học viên
  - Thu nhập
  - Cài đặt

## API Endpoints

Backend cần implement các endpoints sau:

### GET /tutor/dashboard
Lấy toàn bộ dữ liệu dashboard
```typescript
Response: {
  stats: DashboardStats;
  revenueChart: RevenueChart[];
  recentActivities: StudentActivity[];
  upcomingSessions: UpcomingSession[];
  topCourses: CourseStats[];
}
```

### GET /tutor/dashboard/stats
Chỉ lấy thống kê tổng quan
```typescript
Response: {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  monthlyEarnings: number;
  averageRating: number;
  totalBookings: number;
  activePackages: number;
  pendingBookings: number;
}
```

### GET /tutor/dashboard/revenue-chart?year=2024
Lấy dữ liệu biểu đồ doanh thu
```typescript
Response: Array<{
  month: string; // "Jan", "Feb", ...
  earnings: number;
  bookings: number;
}>
```

### GET /tutor/dashboard/activities?limit=10
Lấy hoạt động gần đây
```typescript
Response: Array<{
  studentId: string;
  studentName: string;
  studentAvatar: string;
  action: string;
  courseName: string;
  timestamp: string; // ISO date
}>
```

### GET /tutor/dashboard/upcoming-sessions?limit=10
Lấy buổi học sắp tới
```typescript
Response: Array<{
  id: string;
  studentName: string;
  studentAvatar: string;
  courseName: string;
  startTime: string; // ISO date
  endTime: string; // ISO date
  packageName?: string;
}>
```

### GET /tutor/dashboard/top-courses?limit=5
Lấy top khóa học
```typescript
Response: Array<{
  courseId: string;
  courseName: string;
  enrollments: number;
  completionRate: number; // 0-100
  revenue: number;
}>
```

## Mock Data vs Real API

Hiện tại dashboard đang sử dụng **mock data** để hiển thị. Để chuyển sang real API:

1. Mở file `api.ts`
2. Thay đổi `USE_MOCK_DATA = true` thành `USE_MOCK_DATA = false`
3. Đảm bảo backend API endpoints đã được implement

```typescript
// api.ts
const USE_MOCK_DATA = false; // Thay đổi thành false để sử dụng real API
```

Mock data được định nghĩa trong file `mockData.ts` với dữ liệu mẫu cho:
- 12 khóa học
- 245 học viên
- Doanh thu 125 triệu VND
- 8 hoạt động gần đây
- 5 buổi học sắp tới
- Top 5 khóa học

## Cấu trúc thư mục

```
Dashboard/
├── index.tsx                 # Component chính
├── api.ts                   # API calls (hỗ trợ mock/real)
├── types.ts                 # TypeScript types
├── mockData.ts              # Mock data
├── README.md               # File này
├── components/             # Các component con
│   ├── StatCard.tsx
│   ├── RevenueChart.tsx
│   ├── RecentActivities.tsx
│   ├── UpcomingSessions.tsx
│   ├── TopCourses.tsx
│   ├── QuickActions.tsx
│   └── index.ts
├── hooks/                  # Custom hooks
│   └── useDashboardData.ts
└── utils/                  # Utility functions
    └── formatters.ts
```

## Sử dụng

```tsx
import TutorDashboard from '@/pages/TutorPages/Dashboard';

// Trong router
<Route path="/tutor/dashboard" element={<TutorDashboard />} />
```

## Dependencies

- `recharts`: Thư viện vẽ biểu đồ
- `@tanstack/react-query`: Quản lý API calls
- `date-fns`: Format ngày tháng
- `lucide-react`: Icons

## Tự động refresh

Dashboard tự động refresh dữ liệu:
- Thống kê tổng quan: mỗi 30 giây
- Biểu đồ doanh thu: mỗi 2 phút
- Hoạt động gần đây: mỗi 30 giây
- Buổi học sắp tới: mỗi 30 giây
- Top khóa học: mỗi 2 phút
