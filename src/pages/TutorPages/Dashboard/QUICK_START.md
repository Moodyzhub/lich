# Quick Start Guide - Tutor Dashboard

## Trạng thái hiện tại

✅ **Dashboard đang hoạt động với MOCK DATA**

Trang dashboard hiện đang sử dụng dữ liệu mẫu (mock data) để hiển thị. Điều này cho phép bạn xem và test giao diện mà không cần backend API.

## Mock Data bao gồm

- **12 khóa học** đã tạo
- **245 học viên** đang học
- **125.000.000 VND** tổng thu nhập
- **18.500.000 VND** thu nhập tháng này
- **4.7/5** đánh giá trung bình
- **156 lượt đặt** lịch
- **8 gói dịch vụ** đang hoạt động
- **5 lịch** chờ xác nhận

## Các tính năng có sẵn

✅ Thống kê tổng quan (8 thẻ thống kê)
✅ Biểu đồ doanh thu theo tháng (cột và đường)
✅ Hoạt động gần đây (8 hoạt động)
✅ Buổi học sắp tới (5 buổi)
✅ Top 5 khóa học hàng đầu
✅ Thao tác nhanh (6 nút)
✅ Tự động refresh dữ liệu
✅ Hỗ trợ dark mode
✅ Responsive design

## Chuyển sang Real API

Khi backend API đã sẵn sàng:

1. **Mở file:** `src/pages/TutorPages/Dashboard/api.ts`

2. **Thay đổi dòng 12:**
   ```typescript
   const USE_MOCK_DATA = false; // Thay từ true → false
   ```

3. **Đảm bảo backend có các endpoints:**
   - `GET /tutor/dashboard`
   - `GET /tutor/dashboard/stats`
   - `GET /tutor/dashboard/revenue-chart`
   - `GET /tutor/dashboard/activities`
   - `GET /tutor/dashboard/upcoming-sessions`
   - `GET /tutor/dashboard/top-courses`

## Customize Mock Data

Muốn thay đổi dữ liệu mẫu?

**File:** `src/pages/TutorPages/Dashboard/mockData.ts`

Bạn có thể chỉnh sửa:
- Số lượng khóa học, học viên
- Doanh thu các tháng
- Tên học viên, khóa học
- Thời gian buổi học
- Avatar URLs

## Troubleshooting

### Dashboard không hiển thị?

1. Kiểm tra console log có lỗi không
2. Đảm bảo `USE_MOCK_DATA = true` trong `api.ts`
3. Clear cache và refresh lại trang

### Muốn thêm/bớt dữ liệu mock?

Chỉnh sửa các array trong `mockData.ts`:
- `mockRecentActivities` - Thêm/bớt hoạt động
- `mockUpcomingSessions` - Thêm/bớt buổi học
- `mockTopCourses` - Thêm/bớt khóa học

### Biểu đồ không hiển thị đúng?

Kiểm tra `mockRevenueChart` có đủ 12 tháng không.

## Support

Cần trợ giúp? Liên hệ team development hoặc xem file `README.md` để biết thêm chi tiết.
