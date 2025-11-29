import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { CourseStats } from '../types';
import { Progress } from '@/components/ui/progress';

interface TopCoursesProps {
  courses: CourseStats[];
}

export const TopCourses: React.FC<TopCoursesProps> = ({ courses }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Khóa học hàng đầu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có khóa học nào
            </div>
          ) : (
            courses.map((course, index) => (
              <div
                key={course.courseId}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {course.courseName}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Học viên</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {course.enrollments}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Hoàn thành</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {course.completionRate}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Doanh thu</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(course.revenue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tỷ lệ hoàn thành
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.completionRate}%
                    </span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
