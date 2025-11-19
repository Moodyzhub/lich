import axios from '@/config/axiosConfig';

export interface BookedSession {
  id: number;
  date: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  studentName: string;
  studentAvatar?: string;
  studentEmail: string;
  studentPhone?: string;
  packageName: string;
  sessionNumber: number;
  totalSessions: number;
  topic?: string;
  meetLink?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface AvailableSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TutorScheduleResponse {
  availableSlots: AvailableSlot[];
  bookedSessions: BookedSession[];
}

export const scheduleApi = {
  getTutorSchedule: async (startDate?: string, endDate?: string): Promise<TutorScheduleResponse> => {
    try {
      console.log('🔍 Fetching tutor schedule');

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/tutor/schedule${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url);

      console.log('📅 Schedule response:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching schedule:', error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền truy cập lịch này.');
          case 404:
            throw new Error('Không tìm thấy lịch làm việc.');
          case 500:
            throw new Error('Lỗi server. Vui lòng thử lại sau.');
          default:
            throw new Error(message || 'Không thể tải lịch làm việc. Vui lòng thử lại.');
        }
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error(error.message || 'Đã xảy ra lỗi không xác định.');
      }
    }
  },

  getBookedSessions: async (startDate?: string, endDate?: string): Promise<BookedSession[]> => {
    try {
      console.log('🔍 Fetching booked sessions');

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/tutor/booked-sessions${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url);

      console.log('📚 Booked sessions response:', response.data);

      const sessions = Array.isArray(response.data) ? response.data : response.data?.sessions || [];

      return sessions.map((session: any) => ({
        id: session.id || session.booking_id,
        date: session.date || session.booking_date,
        dayOfWeek: new Date(session.date || session.booking_date).getDay(),
        startTime: session.start_time || session.startTime,
        endTime: session.end_time || session.endTime,
        studentName: session.student_name || session.studentName || 'Học viên',
        studentAvatar: session.student_avatar || session.studentAvatar,
        studentEmail: session.student_email || session.studentEmail || '',
        studentPhone: session.student_phone || session.studentPhone,
        packageName: session.package_name || session.packageName || 'Package',
        sessionNumber: session.session_number || session.sessionNumber || 1,
        totalSessions: session.total_sessions || session.totalSessions || 1,
        topic: session.topic || session.lesson_topic,
        meetLink: session.meet_link || session.meetLink || session.meeting_link,
        status: session.status || 'pending',
        notes: session.notes || session.note,
      }));
    } catch (error: any) {
      console.error('❌ Error fetching booked sessions:', error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền truy cập dữ liệu này.');
          case 404:
            throw new Error('Không tìm thấy buổi học nào.');
          case 500:
            throw new Error('Lỗi server. Vui lòng thử lại sau.');
          default:
            throw new Error(message || 'Không thể tải danh sách buổi học. Vui lòng thử lại.');
        }
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error(error.message || 'Đã xảy ra lỗi không xác định.');
      }
    }
  },

  getAvailableSchedule: async (): Promise<Record<string, string[]>> => {
    try {
      console.log('🔍 Fetching available schedule');

      const response = await axios.get('/tutor/available-schedule');

      console.log('📆 Available schedule response:', response.data);

      return response.data?.schedule || response.data || {};
    } catch (error: any) {
      console.error('❌ Error fetching available schedule:', error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
          case 401:
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          case 403:
            throw new Error('Bạn không có quyền truy cập lịch này.');
          case 404:
            throw new Error('Chưa có lịch khả dụng. Vui lòng thiết lập lịch làm việc.');
          case 500:
            throw new Error('Lỗi server. Vui lòng thử lại sau.');
          default:
            throw new Error(message || 'Không thể tải lịch khả dụng. Vui lòng thử lại.');
        }
      } else if (error.request) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error(error.message || 'Đã xảy ra lỗi không xác định.');
      }
    }
  },
};

export default scheduleApi;
