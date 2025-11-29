import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, UserPlus, BookOpen, Star, CheckCircle } from 'lucide-react';
import { StudentActivity } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RecentActivitiesProps {
  activities: StudentActivity[];
}

const getActivityIcon = (action: string) => {
  const actionLower = action.toLowerCase();
  if (actionLower.includes('enroll') || actionLower.includes('đăng ký')) {
    return <UserPlus className="h-4 w-4" />;
  }
  if (actionLower.includes('complete') || actionLower.includes('hoàn thành')) {
    return <CheckCircle className="h-4 w-4" />;
  }
  if (actionLower.includes('review') || actionLower.includes('đánh giá')) {
    return <Star className="h-4 w-4" />;
  }
  return <BookOpen className="h-4 w-4" />;
};

const getActivityColor = (action: string) => {
  const actionLower = action.toLowerCase();
  if (actionLower.includes('enroll') || actionLower.includes('đăng ký')) {
    return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
  }
  if (actionLower.includes('complete') || actionLower.includes('hoàn thành')) {
    return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
  }
  if (actionLower.includes('review') || actionLower.includes('đánh giá')) {
    return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400';
  }
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có hoạt động nào
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={`${activity.studentId}-${index}`}
                className="flex items-start gap-3 pb-4 border-b last:border-0 border-gray-200 dark:border-gray-700"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activity.studentAvatar} alt={activity.studentName} />
                  <AvatarFallback>
                    {activity.studentName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div
                      className={`p-1.5 rounded-full ${getActivityColor(activity.action)}`}
                    >
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.studentName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                        {activity.courseName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
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
