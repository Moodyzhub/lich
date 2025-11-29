import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, UserPlus, BookOpen, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { PlatformActivity } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PlatformActivitiesProps {
  activities: PlatformActivity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_registered':
      return <UserPlus className="h-4 w-4" />;
    case 'course_created':
      return <BookOpen className="h-4 w-4" />;
    case 'booking_made':
      return <Calendar className="h-4 w-4" />;
    case 'payment_completed':
      return <DollarSign className="h-4 w-4" />;
    case 'tutor_approved':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'user_registered':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
    case 'course_created':
      return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
    case 'booking_made':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400';
    case 'payment_completed':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400';
    case 'tutor_approved':
      return 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  }
};

export const PlatformActivities: React.FC<PlatformActivitiesProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hoạt động gần đây trên nền tảng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có hoạt động nào
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0 border-gray-200 dark:border-gray-700"
              >
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
