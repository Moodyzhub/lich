import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Package,
  User,
  BookOpen,
  Phone,
  Mail,
  Filter,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { scheduleApi, BookedSession } from './schedule-api';

const MOCK_AVAILABLE_SCHEDULE = {
  Monday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  Tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  Wednesday: ['09:00', '10:00', '13:00', '14:00', '15:00'],
  Thursday: ['09:00', '10:00', '13:00', '14:00', '16:00', '17:00'],
  Friday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  Saturday: ['10:00', '11:00', '14:00', '15:00'],
  Sunday: ['14:00', '15:00'],
};

const MOCK_BOOKED_SESSIONS = [
  {
    id: 1,
    date: '2024-11-20',
    dayOfWeek: 3,
    startTime: '09:00',
    endTime: '10:00',
    studentName: 'Nguyễn Văn An',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    studentEmail: 'nguyenvanan@email.com',
    studentPhone: '0901234567',
    packageName: 'Premium English 1-on-1',
    sessionNumber: 7,
    totalSessions: 10,
    topic: 'Advanced Grammar',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmed',
    notes: 'Focus on conditional sentences',
  },
  {
    id: 2,
    date: '2024-11-20',
    dayOfWeek: 3,
    startTime: '14:00',
    endTime: '15:00',
    studentName: 'Trần Thị Bình',
    studentAvatar: 'https://i.pravatar.cc/150?img=5',
    studentEmail: 'tranthibinh@email.com',
    studentPhone: '0912345678',
    packageName: 'IELTS Speaking',
    sessionNumber: 4,
    totalSessions: 5,
    topic: 'IELTS Speaking Part 3',
    meetLink: 'https://meet.google.com/xyz-uvw-rst',
    status: 'confirmed',
    notes: 'Practice abstract topics',
  },
  {
    id: 3,
    date: '2024-11-21',
    dayOfWeek: 4,
    startTime: '10:00',
    endTime: '11:00',
    studentName: 'Lê Hoàng Minh',
    studentAvatar: 'https://i.pravatar.cc/150?img=12',
    studentEmail: 'lehoangminh@email.com',
    studentPhone: '0923456789',
    packageName: 'Business English',
    sessionNumber: 2,
    totalSessions: 8,
    topic: 'Presentation Skills',
    meetLink: 'https://meet.google.com/lmn-opq-tuv',
    status: 'confirmed',
    notes: 'Prepare business case study',
  },
  {
    id: 4,
    date: '2024-11-22',
    dayOfWeek: 5,
    startTime: '13:00',
    endTime: '14:00',
    studentName: 'Phạm Thu Hà',
    studentAvatar: 'https://i.pravatar.cc/150?img=9',
    studentEmail: 'phamthuha@email.com',
    studentPhone: '0934567890',
    packageName: 'Basic Conversation',
    sessionNumber: 3,
    totalSessions: 8,
    topic: 'Hobbies & Interests',
    meetLink: 'https://meet.google.com/wxy-zab-cde',
    status: 'pending',
    notes: '',
  },
  {
    id: 5,
    date: '2024-11-22',
    dayOfWeek: 5,
    startTime: '16:00',
    endTime: '17:00',
    studentName: 'Hoàng Văn Đức',
    studentAvatar: 'https://i.pravatar.cc/150?img=15',
    studentEmail: 'hoangvanduc@email.com',
    studentPhone: '0945678901',
    packageName: 'TOEIC Preparation',
    sessionNumber: 9,
    totalSessions: 12,
    topic: 'Reading Strategies',
    meetLink: 'https://meet.google.com/fgh-ijk-lmn',
    status: 'confirmed',
    notes: 'Focus on time management',
  },
  {
    id: 6,
    date: '2024-11-23',
    dayOfWeek: 6,
    startTime: '10:00',
    endTime: '11:00',
    studentName: 'Nguyễn Văn An',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    studentEmail: 'nguyenvanan@email.com',
    studentPhone: '0901234567',
    packageName: 'Premium English 1-on-1',
    sessionNumber: 8,
    totalSessions: 10,
    topic: 'Writing Practice',
    meetLink: 'https://meet.google.com/opq-rst-uvw',
    status: 'confirmed',
    notes: 'Essay structure review',
  },
  {
    id: 7,
    date: '2024-11-24',
    dayOfWeek: 0,
    startTime: '15:00',
    endTime: '16:00',
    studentName: 'Trần Thị Bình',
    studentAvatar: 'https://i.pravatar.cc/150?img=5',
    studentEmail: 'tranthibinh@email.com',
    studentPhone: '0912345678',
    packageName: 'IELTS Speaking',
    sessionNumber: 5,
    totalSessions: 5,
    topic: 'Final Mock Test',
    meetLink: 'https://meet.google.com/xyz-abc-def',
    status: 'confirmed',
    notes: 'Complete exam simulation',
  },
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_OF_WEEK_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusBadge = (status: string) => {
  if (status === 'confirmed') {
    return <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Đã xác nhận</Badge>;
  }
  return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">Chờ xác nhận</Badge>;
};

const getWeekDates = (currentDate: Date) => {
  const week = [];
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    week.push(date);
  }

  return week;
};

export default function TutorSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<BookedSession | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([]);
  const [availableSchedule, setAvailableSchedule] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekDates = getWeekDates(currentDate);

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate]);

  const fetchScheduleData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const startDate = weekDates[0].toISOString().split('T')[0];
      const endDate = weekDates[6].toISOString().split('T')[0];

      const [sessionsData, scheduleData] = await Promise.all([
        scheduleApi.getBookedSessions(startDate, endDate),
        scheduleApi.getAvailableSchedule(),
      ]);

      setBookedSessions(sessionsData);
      setAvailableSchedule(scheduleData);
    } catch (err: any) {
      console.error('Error fetching schedule:', err);
      setError(err.message);
      toast.error(err.message || 'Không thể tải lịch làm việc');

      setBookedSessions([]);
      setAvailableSchedule(MOCK_AVAILABLE_SCHEDULE);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookedSessions.filter(session => session.date === dateStr);
  };

  const getSessionAtTime = (date: Date, timeSlot: string) => {
    const sessions = getSessionsForDate(date);
    return sessions.find(session => session.startTime === timeSlot);
  };

  const isSlotAvailable = (date: Date, timeSlot: string) => {
    const dayName = DAYS_OF_WEEK[date.getDay()];
    return availableSchedule[dayName]?.includes(timeSlot) || false;
  };

  const handleSessionClick = (session: BookedSession) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  const totalAvailableSlots = Object.values(availableSchedule).reduce((sum, slots) => sum + slots.length, 0);
  const bookedSlotsThisWeek = bookedSessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= weekDates[0] && sessionDate <= weekDates[6];
  }).length;

  const stats = {
    todaySessions: bookedSessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
    weekSessions: bookedSlotsThisWeek,
    totalAvailableSlots: totalAvailableSlots,
    availableThisWeek: weekDates.reduce((sum, date) => {
      const dayName = DAYS_OF_WEEK[date.getDay()];
      const availableCount = availableSchedule[dayName]?.length || 0;
      const bookedCount = getSessionsForDate(date).length;
      return sum + (availableCount - bookedCount);
    }, 0),
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải lịch làm việc...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Lịch làm việc</h1>
                <p className="text-blue-100 text-sm">Xem lịch khả dụng và các buổi học đã được đặt</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Slot khả dụng tuần</div>
                      <div className="text-2xl font-bold">{stats.availableThisWeek}</div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Đã book tuần này</div>
                      <div className="text-2xl font-bold">{stats.weekSessions}</div>
                    </div>
                    <CalendarDays className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Tổng slot đăng ký</div>
                      <div className="text-2xl font-bold">{stats.totalAvailableSlots}</div>
                    </div>
                    <Clock className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Buổi hôm nay</div>
                      <div className="text-2xl font-bold">{stats.todaySessions}</div>
                    </div>
                    <BookOpen className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleToday}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Hôm nay
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-sm font-semibold min-w-[200px] text-center">
                    {weekDates[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    {' - '}
                    {weekDates[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleNextWeek}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                    <span className="text-gray-600">Khả dụng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                    <span className="text-gray-600">Đã book</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
                    <span className="text-gray-600">Không khả dụng</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                <div className="grid grid-cols-8 border-b">
                  <div className="p-4 bg-gray-50 border-r font-semibold text-sm text-gray-600">
                    Giờ
                  </div>
                  {weekDates.map((date, index) => (
                    <div
                      key={index}
                      className={`p-4 text-center border-r last:border-r-0 ${
                        isToday(date) ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {DAYS_OF_WEEK_SHORT[date.getDay()]}
                      </div>
                      <div className={`text-lg font-semibold ${
                        isToday(date) ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Tháng {date.getMonth() + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  {TIME_SLOTS.map((timeSlot, timeIndex) => (
                    <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-gray-50/50">
                      <div className="p-3 border-r bg-gray-50 text-sm text-gray-600 font-medium">
                        {timeSlot}
                      </div>
                      {weekDates.map((date, dayIndex) => {
                        const session = getSessionAtTime(date, timeSlot);
                        const isAvailable = isSlotAvailable(date, timeSlot);

                        return (
                          <div
                            key={`${dayIndex}-${timeIndex}`}
                            className={`p-2 border-r last:border-r-0 min-h-[80px] ${
                              isToday(date) ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            {session ? (
                              <div
                                onClick={() => handleSessionClick(session)}
                                className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <Avatar className="w-6 h-6 border-2 border-white">
                                    <AvatarImage src={session.studentAvatar} alt={session.studentName} />
                                    <AvatarFallback className="text-xs">{session.studentName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-white truncate">
                                      {session.studentName}
                                    </div>
                                    <div className="text-[10px] text-blue-100">
                                      {session.startTime} - {session.endTime}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[10px] text-white/90 truncate mb-1">
                                  {session.topic}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="w-3 h-3 text-white/80" />
                                  <div className="text-[9px] text-white/80 truncate">
                                    {session.packageName}
                                  </div>
                                </div>
                              </div>
                            ) : isAvailable ? (
                              <div className="h-full bg-green-50 border border-green-200 rounded-lg p-2 flex items-center justify-center hover:bg-green-100 transition-colors">
                                <div className="text-center">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
                                  <div className="text-[10px] text-green-700 font-medium">Khả dụng</div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              <div>Chi tiết buổi học</div>
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về buổi học và học viên
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedSession.studentAvatar} alt={selectedSession.studentName} />
                  <AvatarFallback>{selectedSession.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{selectedSession.studentName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    {selectedSession.studentEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {selectedSession.studentPhone}
                  </div>
                </div>
                {getStatusBadge(selectedSession.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <CalendarIcon className="w-4 h-4" />
                      <div className="text-sm font-medium">Ngày học</div>
                    </div>
                    <div className="font-semibold">{formatDate(selectedSession.date)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-sm font-medium">Thời gian</div>
                    </div>
                    <div className="font-semibold">
                      {selectedSession.startTime} - {selectedSession.endTime}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Package className="w-4 h-4" />
                      <div className="text-sm font-medium">Package</div>
                    </div>
                    <div className="font-semibold text-sm">{selectedSession.packageName}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <div className="text-sm font-medium">Buổi học</div>
                    </div>
                    <div className="font-semibold">
                      {selectedSession.sessionNumber} / {selectedSession.totalSessions}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="font-semibold mb-2 text-blue-900">Chủ đề buổi học</div>
                  <div className="text-blue-800">{selectedSession.topic}</div>
                </CardContent>
              </Card>

              {selectedSession.notes && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="pt-4">
                    <div className="font-semibold mb-2 text-amber-900">Ghi chú</div>
                    <div className="text-amber-800">{selectedSession.notes}</div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-green-900 font-semibold mb-2">
                        <Video className="w-5 h-5" />
                        Link phòng học
                      </div>
                      <div className="text-sm text-green-700 break-all">
                        {selectedSession.meetLink}
                      </div>
                    </div>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(selectedSession.meetLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Tham gia
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                  Đóng
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Video className="w-4 h-4 mr-2" />
                  Vào phòng học
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
