import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CalendarDays,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Package,
  Video,
  MessageSquare,
  Eye,
  MoreVertical,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MOCK_BOOKING_STUDENTS = [
  {
    id: 1,
    studentId: 101,
    studentName: 'Nguyễn Văn An',
    studentEmail: 'nguyenvanan@email.com',
    studentPhone: '0901234567',
    studentAvatar: 'https://i.pravatar.cc/150?img=1',
    packageId: 1,
    packageName: 'Premium English 1-on-1 (10 Sessions)',
    packageType: 'premium',
    totalSessions: 10,
    completedSessions: 6,
    upcomingSessions: 2,
    cancelledSessions: 1,
    remainingSessions: 1,
    purchaseDate: '2024-01-10',
    expiryDate: '2024-04-10',
    status: 'active',
    sessions: [
      {
        id: 1,
        date: '2024-01-15',
        time: '09:00 - 10:00',
        topic: 'Grammar Basics',
        status: 'completed',
        notes: 'Student showed great improvement',
      },
      {
        id: 2,
        date: '2024-01-20',
        time: '09:00 - 10:00',
        topic: 'Pronunciation Practice',
        status: 'completed',
        notes: 'Needs more practice with vowels',
      },
      {
        id: 3,
        date: '2024-01-25',
        time: '09:00 - 10:00',
        topic: 'Conversation Skills',
        status: 'completed',
        notes: 'Very confident in speaking',
      },
      {
        id: 4,
        date: '2024-02-01',
        time: '09:00 - 10:00',
        topic: 'Business English',
        status: 'completed',
        notes: 'Good understanding of business terms',
      },
      {
        id: 5,
        date: '2024-02-10',
        time: '09:00 - 10:00',
        topic: 'Writing Skills',
        status: 'completed',
        notes: 'Excellent essay structure',
      },
      {
        id: 6,
        date: '2024-02-15',
        time: '09:00 - 10:00',
        topic: 'Reading Comprehension',
        status: 'completed',
        notes: 'Strong reading abilities',
      },
      {
        id: 7,
        date: '2024-02-20',
        time: '14:00 - 15:00',
        topic: 'Listening Practice',
        status: 'cancelled',
        notes: 'Student had emergency',
      },
      {
        id: 8,
        date: '2024-03-20',
        time: '10:00 - 11:00',
        topic: 'Advanced Grammar',
        status: 'upcoming',
        notes: '',
      },
      {
        id: 9,
        date: '2024-03-25',
        time: '10:00 - 11:00',
        topic: 'IELTS Speaking Tips',
        status: 'upcoming',
        notes: '',
      },
    ],
  },
  {
    id: 2,
    studentId: 102,
    studentName: 'Trần Thị Bình',
    studentEmail: 'tranthibinh@email.com',
    studentPhone: '0912345678',
    studentAvatar: 'https://i.pravatar.cc/150?img=5',
    packageId: 2,
    packageName: 'Standard IELTS Package (5 Sessions)',
    packageType: 'standard',
    totalSessions: 5,
    completedSessions: 3,
    upcomingSessions: 1,
    cancelledSessions: 0,
    remainingSessions: 1,
    purchaseDate: '2024-02-01',
    expiryDate: '2024-05-01',
    status: 'active',
    sessions: [
      {
        id: 10,
        date: '2024-02-05',
        time: '14:00 - 15:00',
        topic: 'IELTS Writing Task 1',
        status: 'completed',
        notes: 'Good grasp of data description',
      },
      {
        id: 11,
        date: '2024-02-12',
        time: '14:00 - 15:00',
        topic: 'IELTS Writing Task 2',
        status: 'completed',
        notes: 'Strong argumentative skills',
      },
      {
        id: 12,
        date: '2024-02-19',
        time: '14:00 - 15:00',
        topic: 'IELTS Speaking Part 1 & 2',
        status: 'completed',
        notes: 'Confident speaker',
      },
      {
        id: 13,
        date: '2024-03-22',
        time: '15:00 - 16:00',
        topic: 'IELTS Speaking Part 3',
        status: 'upcoming',
        notes: '',
      },
    ],
  },
  {
    id: 3,
    studentId: 103,
    studentName: 'Lê Hoàng Minh',
    studentEmail: 'lehoangminh@email.com',
    studentPhone: '0923456789',
    studentAvatar: 'https://i.pravatar.cc/150?img=12',
    packageId: 3,
    packageName: 'Intensive Business English (15 Sessions)',
    packageType: 'intensive',
    totalSessions: 15,
    completedSessions: 15,
    upcomingSessions: 0,
    cancelledSessions: 0,
    remainingSessions: 0,
    purchaseDate: '2023-12-01',
    expiryDate: '2024-03-01',
    status: 'completed',
    sessions: [
      {
        id: 14,
        date: '2023-12-05',
        time: '16:00 - 17:00',
        topic: 'Business Vocabulary',
        status: 'completed',
        notes: 'Excellent progress',
      },
      {
        id: 15,
        date: '2023-12-08',
        time: '16:00 - 17:00',
        topic: 'Email Writing',
        status: 'completed',
        notes: 'Professional writing style',
      },
    ],
  },
  {
    id: 4,
    studentId: 104,
    studentName: 'Phạm Thu Hà',
    studentEmail: 'phamthuha@email.com',
    studentPhone: '0934567890',
    studentAvatar: 'https://i.pravatar.cc/150?img=9',
    packageId: 4,
    packageName: 'Basic Conversation (8 Sessions)',
    packageType: 'basic',
    totalSessions: 8,
    completedSessions: 2,
    upcomingSessions: 3,
    cancelledSessions: 0,
    remainingSessions: 3,
    purchaseDate: '2024-02-20',
    expiryDate: '2024-05-20',
    status: 'active',
    sessions: [
      {
        id: 16,
        date: '2024-02-25',
        time: '13:00 - 14:00',
        topic: 'Self Introduction',
        status: 'completed',
        notes: 'Shy but improving',
      },
      {
        id: 17,
        date: '2024-03-01',
        time: '13:00 - 14:00',
        topic: 'Daily Routines',
        status: 'completed',
        notes: 'Good vocabulary retention',
      },
      {
        id: 18,
        date: '2024-03-21',
        time: '13:00 - 14:00',
        topic: 'Hobbies & Interests',
        status: 'upcoming',
        notes: '',
      },
      {
        id: 19,
        date: '2024-03-26',
        time: '13:00 - 14:00',
        topic: 'Travel & Transportation',
        status: 'upcoming',
        notes: '',
      },
      {
        id: 20,
        date: '2024-03-30',
        time: '13:00 - 14:00',
        topic: 'Food & Restaurants',
        status: 'upcoming',
        notes: '',
      },
    ],
  },
  {
    id: 5,
    studentId: 105,
    studentName: 'Hoàng Văn Đức',
    studentEmail: 'hoangvanduc@email.com',
    studentPhone: '0945678901',
    studentAvatar: 'https://i.pravatar.cc/150?img=15',
    packageId: 5,
    packageName: 'TOEIC Preparation (12 Sessions)',
    packageType: 'premium',
    totalSessions: 12,
    completedSessions: 8,
    upcomingSessions: 2,
    cancelledSessions: 1,
    remainingSessions: 1,
    purchaseDate: '2024-01-05',
    expiryDate: '2024-04-05',
    status: 'active',
    sessions: [
      {
        id: 21,
        date: '2024-01-10',
        time: '15:00 - 16:00',
        topic: 'TOEIC Listening Part 1-2',
        status: 'completed',
        notes: 'Strong listening skills',
      },
      {
        id: 22,
        date: '2024-01-17',
        time: '15:00 - 16:00',
        topic: 'TOEIC Listening Part 3-4',
        status: 'completed',
        notes: 'Needs more practice with accents',
      },
      {
        id: 23,
        date: '2024-03-23',
        time: '16:00 - 17:00',
        topic: 'TOEIC Reading Part 5-6',
        status: 'upcoming',
        notes: '',
      },
      {
        id: 24,
        date: '2024-03-28',
        time: '16:00 - 17:00',
        topic: 'TOEIC Reading Part 7',
        status: 'upcoming',
        notes: '',
      },
    ],
  },
];

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      label: 'Hoàn thành',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    upcoming: {
      icon: Clock,
      label: 'Sắp tới',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    cancelled: {
      icon: XCircle,
      label: 'Đã hủy',
      className: 'bg-red-100 text-red-800 border-red-300',
    },
    active: {
      icon: CheckCircle2,
      label: 'Đang học',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const Icon = config.icon;
  return (
    <Badge className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

const getPackageTypeBadge = (type: string) => {
  const typeConfig = {
    basic: { label: 'Cơ bản', className: 'bg-gray-100 text-gray-800 border-gray-300' },
    standard: { label: 'Tiêu chuẩn', className: 'bg-blue-100 text-blue-800 border-blue-300' },
    premium: { label: 'Cao cấp', className: 'bg-purple-100 text-purple-800 border-purple-300' },
    intensive: { label: 'Chuyên sâu', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  };

  const config = typeConfig[type as keyof typeof typeConfig];
  return <Badge className={config.className}>{config.label}</Badge>;
};

export default function BookingSessions() {
  const [students] = useState(MOCK_BOOKING_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_BOOKING_STUDENTS[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && student.status === 'active') ||
      (filterStatus === 'completed' && student.status === 'completed');

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalStudents: students.length,
    activePackages: students.filter((s) => s.status === 'active').length,
    completedSessions: students.reduce((sum, s) => sum + s.completedSessions, 0),
    upcomingSessions: students.reduce((sum, s) => sum + s.upcomingSessions, 0),
  };

  const handleViewDetails = (student: typeof MOCK_BOOKING_STUDENTS[0]) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Quản lý lịch học 1-1</h1>
                <p className="text-violet-100 text-sm">Theo dõi học viên đã đăng ký package và book lịch</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Tổng học viên</div>
                      <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    </div>
                    <User className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Package đang học</div>
                      <div className="text-2xl font-bold">{stats.activePackages}</div>
                    </div>
                    <Package className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Buổi đã hoàn thành</div>
                      <div className="text-2xl font-bold">{stats.completedSessions}</div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Buổi sắp tới</div>
                      <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                    </div>
                    <Clock className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc package..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  Tất cả
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Đang học
                </Button>
                <Button
                  variant={filterStatus === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('completed')}
                >
                  Hoàn thành
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Học viên</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead className="text-center">Tổng buổi</TableHead>
                    <TableHead className="text-center">Hoàn thành</TableHead>
                    <TableHead className="text-center">Sắp tới</TableHead>
                    <TableHead className="text-center">Còn lại</TableHead>
                    <TableHead className="text-center">Tiến độ</TableHead>
                    <TableHead>Hạn sử dụng</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                        Không tìm thấy học viên nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => {
                      const progressPercent = Math.round(
                        (student.completedSessions / student.totalSessions) * 100
                      );

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={student.studentAvatar} alt={student.studentName} />
                                <AvatarFallback>{student.studentName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{student.studentName}</div>
                                <div className="text-xs text-gray-500">{student.studentEmail}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{student.packageName}</div>
                              {getPackageTypeBadge(student.packageType)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-semibold">{student.totalSessions}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-green-600">
                                {student.completedSessions}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-600">
                                {student.upcomingSessions}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">{student.remainingSessions}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-semibold">{progressPercent}%</span>
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                                <div
                                  className="h-2 rounded-full bg-violet-600"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {formatDate(student.expiryDate)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(student.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Video className="w-4 h-4 mr-2" />
                                  Tham gia buổi học
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Nhắn tin
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedStudent?.studentAvatar} alt={selectedStudent?.studentName} />
                <AvatarFallback>{selectedStudent?.studentName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl">{selectedStudent?.studentName}</div>
                <div className="text-sm text-gray-500 font-normal">{selectedStudent?.studentEmail}</div>
              </div>
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết package và lịch học của học viên</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Số điện thoại</div>
                    <div className="font-semibold">{selectedStudent.studentPhone}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Ngày mua package</div>
                    <div className="font-semibold">{formatDate(selectedStudent.purchaseDate)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Hạn sử dụng</div>
                    <div className="font-semibold">{formatDate(selectedStudent.expiryDate)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Trạng thái</div>
                    <div>{getStatusBadge(selectedStudent.status)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedStudent.packageName}</h3>
                      <div className="mt-1">{getPackageTypeBadge(selectedStudent.packageType)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-violet-600">
                        {Math.round(
                          (selectedStudent.completedSessions / selectedStudent.totalSessions) * 100
                        )}
                        %
                      </div>
                      <div className="text-xs text-gray-500">Hoàn thành</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedStudent.totalSessions}</div>
                      <div className="text-xs text-gray-500">Tổng buổi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedStudent.completedSessions}
                      </div>
                      <div className="text-xs text-gray-500">Hoàn thành</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedStudent.upcomingSessions}
                      </div>
                      <div className="text-xs text-gray-500">Sắp tới</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedStudent.remainingSessions}
                      </div>
                      <div className="text-xs text-gray-500">Còn lại</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="font-semibold text-lg mb-3">Lịch học chi tiết</h3>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Tất cả ({selectedStudent.sessions.length})</TabsTrigger>
                    <TabsTrigger value="completed">
                      Hoàn thành ({selectedStudent.completedSessions})
                    </TabsTrigger>
                    <TabsTrigger value="upcoming">
                      Sắp tới ({selectedStudent.upcomingSessions})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3 mt-4">
                    {selectedStudent.sessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{session.topic}</div>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(session.date)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {session.time}
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(session.status)}
                          </div>
                          {session.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <div className="text-xs font-medium text-gray-500 mb-1">Ghi chú</div>
                              <div className="text-sm text-gray-700">{session.notes}</div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-3 mt-4">
                    {selectedStudent.sessions
                      .filter((s) => s.status === 'completed')
                      .map((session) => (
                        <Card key={session.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-semibold mb-1">{session.topic}</div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(session.date)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {session.time}
                                  </div>
                                </div>
                              </div>
                              {getStatusBadge(session.status)}
                            </div>
                            {session.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                <div className="text-xs font-medium text-gray-500 mb-1">Ghi chú</div>
                                <div className="text-sm text-gray-700">{session.notes}</div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="upcoming" className="space-y-3 mt-4">
                    {selectedStudent.sessions
                      .filter((s) => s.status === 'upcoming')
                      .map((session) => (
                        <Card key={session.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-semibold mb-1">{session.topic}</div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(session.date)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {session.time}
                                  </div>
                                </div>
                              </div>
                              {getStatusBadge(session.status)}
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Video className="w-4 h-4 mr-2" />
                                Tham gia buổi học
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Nhắn tin
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
