import { useState, useEffect } from 'react';
import api from '@/config/axiosConfig.ts';
import HeroSection from './components/sections/hero-section';
import CalendarView from './components/sections/calendar-view';
import UpcomingSessions from './components/sections/upcoming-sessions';
import type {
  BookingSlot,
  BookingSlotAPI,
  BookingStats,
} from '@/types/MyBooking';

const MyBookings = () => {
  const [bookings, setBookings] = useState<BookingSlot[]>([]);
  const [userID, setUserID] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Fetch user ID
  useEffect(() => {
    api.get('/users/myInfo').then((res) => {
      setUserID(res.data.result?.userID);
    });
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (!userID) return;
    api.get('/booking-slots/my-slots').then((res) => {
      // Map API response (snake_case) to component interface (camelCase)
      const apiSlots: BookingSlotAPI[] = res.data.result || [];
      const mappedSlots: BookingSlot[] = apiSlots
        .filter((b) => b.user_id === userID)
        .map((b) => ({
          slotID: b.slotid,
          bookingPlanID: b.booking_planid,
          tutorID: b.tutor_id,
          userID: b.user_id,
          startTime: b.start_time,
          endTime: b.end_time,
          paymentID: b.payment_id,
          status: b.status,
          lockedAt: b.locked_at,
          expiresAt: b.expires_at,
          learnerName: b.learner_name,
          meetingUrl: b.meeting_url,
          tutorFullname: b.tutor_fullname,
        }));
      setBookings(mappedSlots);
    });
  }, [userID]);

  const calculateStats = (): BookingStats => {
    const now = new Date();

    const upcomingSlots = bookings.filter((b) => {
      const endTime = new Date(b.endTime);
      return endTime >= now;
    });

    const expiredSlots = bookings.filter((b) => {
      const endTime = new Date(b.endTime);
      return endTime < now;
    });

    const totalHours = bookings.reduce((acc, b) => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    return {
      upcoming: upcomingSlots.length,
      expired: expiredSlots.length,
      totalSlots: bookings.length,
      totalHours: Math.round(totalHours),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection stats={calculateStats()} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
              bookings={bookings}
              userID={userID}
            />
          </div>

          <div>
            <UpcomingSessions
              bookings={bookings}
              selectedDate={selectedDate}
              userID={userID}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
