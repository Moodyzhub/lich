import { Calendar, Clock } from 'lucide-react';
import type { BookingSlot } from '@/types/MyBooking';

interface UpcomingSessionsProps {
  bookings: BookingSlot[];
  selectedDate: string | null;
  userID: number | null;
}

const UpcomingSessions = ({
  bookings,
  selectedDate,
  userID,
}: UpcomingSessionsProps) => {
  if (!selectedDate) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center py-8">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Vui lòng chọn ngày</p>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
    return bookingDate === selectedDate && b.userID === userID;
  });

  if (filteredBookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center py-8">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Không có buổi học nào trong ngày này</p>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        Buổi học ngày {selectedDate}
      </h3>

      <div className="space-y-3">
        {filteredBookings.map((booking) => {
          const startTime = new Date(booking.startTime);
          const endTime = new Date(booking.endTime);
          const isPast = endTime < now;

          return (
            <div
              key={booking.slotID}
              className={`rounded-xl p-4 border ${
                isPast
                  ? 'bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-300'
                  : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock
                  className={`w-4 h-4 ${isPast ? 'text-slate-500' : 'text-blue-600'}`}
                />
                <span
                  className={`font-semibold ${isPast ? 'text-slate-600' : 'text-slate-900'}`}
                >
                  {startTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {endTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="text-sm text-slate-600 space-y-1">
                {booking.tutorFullname && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">
                      Gia sư:
                    </span>
                    <span className="text-blue-600 font-medium">
                      {booking.tutorFullname}
                    </span>
                  </div>
                )}
                <div>
                  Trạng thái:{' '}
                  <span
                    className={`font-medium ${isPast ? 'text-slate-500' : 'text-blue-600'}`}
                  >
                    {isPast ? 'Đã qua' : booking.status}
                  </span>
                </div>
                <div>Mã buổi học: {booking.slotID}</div>

                {booking.meetingUrl ? (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <a
                      href={booking.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isPast
                          ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      onClick={(e) => {
                        if (isPast) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" />
                      </svg>
                      {isPast ? 'Buổi học đã kết thúc' : 'Tham gia Google Meet'}
                    </a>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500 italic">
                      Link họp chưa có sẵn
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingSessions;
