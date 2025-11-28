// API Response từ backend (snake_case)
export interface BookingSlotAPI {
  slotid: number;
  booking_planid: number;
  tutor_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  payment_id: number;
  status: string;
  locked_at: string;
  expires_at: string;
  learner_name: string | null;
  meeting_url: string | null;
  tutor_fullname: string | null;
}

// Interface sử dụng trong component (camelCase)
export interface BookingSlot {
  slotID: number;
  bookingPlanID: number;
  tutorID: number;
  userID: number;
  startTime: string;
  endTime: string;
  paymentID: number;
  status: string;
  lockedAt: string;
  expiresAt: string;
  learnerName: string | null;
  meetingUrl: string | null;
  tutorFullname: string | null;
}

export interface BookingStats {
  upcoming: number;
  expired: number;
  totalSlots: number;
  totalHours: number;
}
