import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { RecentCourse } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RecentCoursesProps {
  courses: RecentCourse[];
}

export const RecentCourses: React.FC<RecentCoursesProps> = ({ courses }) => {
  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            Chờ duyệt
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Đã duyệt
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="default" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            Từ chối
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Khóa học mới tạo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có khóa học mới
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2">
                    {course.title}
                  </h4>
                  {getStatusBadge(course.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Giảng viên: <span className="font-medium">{course.tutorName}</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  {formatDistanceToNow(new Date(course.submittedAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
