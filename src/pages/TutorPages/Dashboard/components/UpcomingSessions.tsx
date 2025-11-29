import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video } from 'lucide-react';
import { UpcomingSession } from '../types';
import { format, isToday, isTomorrow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface UpcomingSessionsProps {
  sessions: UpcomingSession[];
}

const getDateLabel = (date: Date) => {
  if (isToday(date)) {
    return 'Hôm nay';
  }
  if (isTomorrow(date)) {
    return 'Ngày mai';
  }
  return format(date, 'dd/MM/yyyy', { locale: vi });
};

export const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({ sessions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Buổi học sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Không có buổi học nào sắp tới
            </div>
          ) : (
            sessions.map((session) => {
              const startDate = new Date(session.startTime);
              const endDate = new Date(session.endTime);

              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-700">
                      <AvatarImage src={session.studentAvatar} alt={session.studentName} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {session.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {session.studentName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {session.courseName}
                      </p>
                      {session.packageName && (
                        <Badge variant="outline" className="mt-1">
                          {session.packageName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      {format(startDate, 'HH:mm', { locale: vi })} -{' '}
                      {format(endDate, 'HH:mm', { locale: vi })}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {getDateLabel(startDate)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {sessions.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Xem tất cả lịch học
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
