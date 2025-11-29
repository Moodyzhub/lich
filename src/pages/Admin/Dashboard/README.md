# Admin Dashboard

Dashboard quản trị hệ thống với đầy đủ thống kê, biểu đồ và giám sát hoạt động.

## ✅ Đang sử dụng MOCK DATA

Dashboard hiện đang hiển thị dữ liệu mẫu. Để chuyển sang real API, thay đổi `USE_MOCK_DATA = false` trong file `api.ts`.

## Tính năng

### 1. Thống kê tổng quan (8 thẻ)
- **Tổng người dùng**: 1,847 người (1,602 học viên + 245 tutor)
- **Tổng khóa học**: 456 khóa (398 đang hoạt động)
- **Doanh thu tháng**: 425.000.000 VND
- **Khóa học chờ duyệt**: 23 khóa
- **Tổng doanh thu**: 4.850.000.000 VND
- **Đơn tutor chờ duyệt**: 12 đơn
- **Yêu cầu rút tiền**: 8 yêu cầu
- **Tổng lượt đặt lịch**: 3,254 lượt

### 2. Biểu đồ doanh thu và hoa hồng
- Hiển thị doanh thu và hoa hồng theo 12 tháng
- Hỗ trợ 2 loại: biểu đồ cột và đường
- Tooltip chi tiết khi hover
- Format tiền tệ VND

### 3. Biểu đồ tăng trưởng người dùng
- Area chart hiển thị số học viên và tutor mới mỗi tháng
- Gradient fill đẹp mắt
- Phân biệt màu: xanh (học viên), cam (tutor)

### 4. Người dùng mới đăng ký
- 6 người dùng gần nhất
- Avatar, tên, email, role
- Badge phân biệt học viên/tutor
- Thời gian tương đối (vd: "2 giờ trước")

### 5. Khóa học mới tạo
- 5 khóa học gần nhất
- Tên khóa học, giảng viên
- Trạng thái: Chờ duyệt / Đã duyệt / Từ chối
- Badge màu sắc theo trạng thái

### 6. Hoạt động nền tảng
- 8 hoạt động gần nhất
- Các loại: Đăng ký, Tạo khóa học, Đặt lịch, Thanh toán, Duyệt tutor
- Icon và màu sắc phân biệt từng loại
- Timestamp tương đối

### 7. Top 5 Tutor xuất sắc
- Xếp hạng theo doanh thu
- Avatar với số thứ hạng
- Đánh giá sao
- Thống kê: Số khóa học, học viên, doanh thu

## Mock Data

### Dữ liệu mẫu bao gồm:
- 1,847 người dùng (1,602 học viên + 245 tutor)
- 456 khóa học
- 4,85 tỷ VND tổng doanh thu
- 425 triệu VND doanh thu tháng
- Dữ liệu 12 tháng cho biểu đồ
- 6 người dùng mới
- 5 khóa học mới
- 8 hoạt động gần đây
- 5 tutor hàng đầu

## Cấu trúc files

```
Dashboard/
├── index.tsx                    # Main dashboard component
├── api.ts                      # API calls (mock/real toggle)
├── types.ts                    # TypeScript interfaces
├── mockData.ts                 # Mock data
├── README.md                   # File này
└── components/
    ├── StatCard.tsx            # Thẻ thống kê
    ├── RevenueChart.tsx        # Biểu đồ doanh thu
    ├── UserGrowthChart.tsx     # Biểu đồ tăng trưởng
    ├── RecentUsers.tsx         # Người dùng mới
    ├── RecentCourses.tsx       # Khóa học mới
    ├── PlatformActivities.tsx  # Hoạt động nền tảng
    ├── TopTutors.tsx           # Top tutor
    └── index.ts
```

## API Endpoints cần implement

Khi backend sẵn sàng, implement các endpoints sau:

### GET /admin/dashboard
Lấy toàn bộ dữ liệu dashboard
```typescript
Response: {
  stats: AdminStats;
  revenueChart: RevenueChart[];
  userGrowthChart: UserGrowthChart[];
  recentUsers: RecentUser[];
  recentCourses: RecentCourse[];
  platformActivities: PlatformActivity[];
  topTutors: TopTutor[];
}
```

### GET /admin/dashboard/stats
Chỉ lấy thống kê
```typescript
Response: {
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
```

## Chuyển sang Real API

1. Mở file `api.ts`
2. Thay đổi:
   ```typescript
   const USE_MOCK_DATA = false; // Thay từ true → false
   ```
3. Đảm bảo backend endpoints đã được implement
4. Test kỹ trước khi deploy

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ Dark mode support
✅ Loading states với spinner
✅ Error handling với alert
✅ Auto refresh mỗi 30 giây
✅ Format tiền tệ VND
✅ Format số với dấu phẩy
✅ Timestamp tiếng Việt
✅ Toggle biểu đồ cột/đường
✅ Gradient area chart
✅ Avatar placeholders
✅ Color-coded badges
✅ Hover effects
✅ Smooth animations

## Dependencies

- `recharts`: Biểu đồ
- `@tanstack/react-query`: API state management
- `date-fns`: Format ngày tháng
- `lucide-react`: Icons
- `@radix-ui`: UI components

## Performance

- Auto refresh: 30 giây
- Query stale time: 20 giây
- Optimized re-renders
- Lazy loading components
- Memoized calculations

## Security

- Admin only access
- Protected routes
- Authentication required
- Role-based permissions
