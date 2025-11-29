import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Star, Users, BookOpen, DollarSign } from 'lucide-react';
import { TopTutor } from '../types';

interface TopTutorsProps {
  tutors: TopTutor[];
}

export const TopTutors: React.FC<TopTutorsProps> = ({ tutors }) => {
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
          <Award className="h-5 w-5" />
          Top 5 Tutor xuất sắc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tutors.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có dữ liệu tutor
            </div>
          ) : (
            tutors.map((tutor, index) => (
              <div
                key={tutor.id}
                className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-white dark:border-gray-700">
                    <AvatarImage src={tutor.avatar} alt={tutor.fullName} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {tutor.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tutor.fullName}
                  </h4>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tutor.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Khóa học</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {tutor.totalCourses}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Học viên</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {tutor.totalStudents}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Doanh thu</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(tutor.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
