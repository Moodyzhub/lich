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
  Users,
  Search,
  Filter,
  BookOpen,
  Clock,
  Award,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ============================================
// MOCK DATA - Easy to remove or replace
// ============================================
const MOCK_STUDENTS = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0901234567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    enrolledCourses: [
      { id: 1, name: 'English for Beginners', enrolledDate: '2024-01-15', progress: 75, status: 'active' },
      { id: 2, name: 'Business English', enrolledDate: '2024-02-20', progress: 45, status: 'active' },
    ],
    totalCourses: 2,
    completedCourses: 0,
    averageProgress: 60,
    lastActive: '2024-03-15',
    joinedDate: '2024-01-10',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '0912345678',
    avatar: 'https://i.pravatar.cc/150?img=5',
    enrolledCourses: [
      { id: 3, name: 'IELTS Preparation', enrolledDate: '2024-01-20', progress: 90, status: 'active' },
    ],
    totalCourses: 1,
    completedCourses: 0,
    averageProgress: 90,
    lastActive: '2024-03-18',
    joinedDate: '2024-01-15',
  },
  {
    id: 3,
    name: 'Lê Hoàng Minh',
    email: 'lehoangminh@email.com',
    phone: '0923456789',
    avatar: 'https://i.pravatar.cc/150?img=12',
    enrolledCourses: [
      { id: 4, name: 'Advanced Grammar', enrolledDate: '2023-12-01', progress: 100, status: 'completed' },
      { id: 5, name: 'Conversation Practice', enrolledDate: '2024-01-10', progress: 30, status: 'active' },
    ],
    totalCourses: 2,
    completedCourses: 1,
    averageProgress: 65,
    lastActive: '2024-03-14',
    joinedDate: '2023-11-25',
  },
  {
    id: 4,
    name: 'Phạm Thu Hà',
    email: 'phamthuha@email.com',
    phone: '0934567890',
    avatar: 'https://i.pravatar.cc/150?img=9',
    enrolledCourses: [
      { id: 6, name: 'English for Beginners', enrolledDate: '2024-02-01', progress: 55, status: 'active' },
      { id: 7, name: 'Pronunciation Mastery', enrolledDate: '2024-02-15', progress: 40, status: 'active' },
      { id: 8, name: 'Reading Comprehension', enrolledDate: '2024-03-01', progress: 20, status: 'active' },
    ],
    totalCourses: 3,
    completedCourses: 0,
    averageProgress: 38,
    lastActive: '2024-03-17',
    joinedDate: '2024-01-28',
  },
  {
    id: 5,
    name: 'Hoàng Văn Đức',
    email: 'hoangvanduc@email.com',
    phone: '0945678901',
    avatar: 'https://i.pravatar.cc/150?img=15',
    enrolledCourses: [
      { id: 9, name: 'Business English', enrolledDate: '2023-11-15', progress: 100, status: 'completed' },
      { id: 10, name: 'TOEIC Preparation', enrolledDate: '2024-01-05', progress: 85, status: 'active' },
    ],
    totalCourses: 2,
    completedCourses: 1,
    averageProgress: 92,
    lastActive: '2024-03-18',
    joinedDate: '2023-11-10',
  },
];
// ============================================
// END MOCK DATA
// ============================================

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getProgressColor = (progress: number): string => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 30) return 'bg-yellow-500';
  return 'bg-gray-400';
};

const getStatusBadge = (status: string) => {
  if (status === 'completed') {
    return <Badge className="bg-green-100 text-green-800 border-green-300">Hoàn thành</Badge>;
  }
  return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Đang học</Badge>;
};

export default function TutorStudents() {
  const [students] = useState(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof MOCK_STUDENTS[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.enrolledCourses.some((c) => c.status === 'active')).length,
    totalEnrollments: students.reduce((sum, s) => sum + s.totalCourses, 0),
    averageProgress: Math.round(
      students.reduce((sum, s) => sum + s.averageProgress, 0) / students.length
    ),
  };

  const handleViewDetails = (student: typeof MOCK_STUDENTS[0]) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Quản lý học viên</h1>
                <p className="text-green-100 text-sm">Theo dõi tiến độ học tập của học viên</p>
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
                    <Users className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Đang hoạt động</div>
                      <div className="text-2xl font-bold">{stats.activeStudents}</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Tổng ghi danh</div>
                      <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
                    </div>
                    <BookOpen className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white/80 mb-1">Tiến độ TB</div>
                      <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                    </div>
                    <Award className="w-8 h-8 text-white/60" />
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
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
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
                    <TableHead className="w-[300px]">Học viên</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead className="text-center">Khóa học</TableHead>
                    <TableHead className="text-center">Hoàn thành</TableHead>
                    <TableHead className="text-center">Tiến độ TB</TableHead>
                    <TableHead>Hoạt động gần nhất</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        Không tìm thấy học viên nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{student.name}</div>
                              <div className="text-xs text-gray-500">
                                Tham gia: {formatDate(student.joinedDate)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">{student.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold">{student.totalCourses}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              {student.completedCourses}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-2">
                            <span className="font-semibold">{student.averageProgress}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(student.averageProgress)}`}
                                style={{ width: `${student.averageProgress}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {formatDate(student.lastActive)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(student)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedStudent?.avatar} alt={selectedStudent?.name} />
                <AvatarFallback>{selectedStudent?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl">{selectedStudent?.name}</div>
                <div className="text-sm text-gray-500 font-normal">{selectedStudent?.email}</div>
              </div>
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và tiến độ học tập của học viên
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Số điện thoại</div>
                    <div className="font-semibold">{selectedStudent.phone}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Ngày tham gia</div>
                    <div className="font-semibold">{formatDate(selectedStudent.joinedDate)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Hoạt động gần nhất</div>
                    <div className="font-semibold">{formatDate(selectedStudent.lastActive)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-gray-600 mb-1">Tiến độ trung bình</div>
                    <div className="font-semibold text-blue-600 text-xl">
                      {selectedStudent.averageProgress}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Khóa học đã đăng ký</h3>
                <div className="space-y-3">
                  {selectedStudent.enrolledCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold mb-1">{course.name}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              Ghi danh: {formatDate(course.enrolledDate)}
                            </div>
                          </div>
                          {getStatusBadge(course.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tiến độ học tập</span>
                            <span className="font-semibold">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
