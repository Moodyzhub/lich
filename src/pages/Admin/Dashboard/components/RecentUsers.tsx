import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { RecentUser } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RecentUsersProps {
  users: RecentUser[];
}

export const RecentUsers: React.FC<RecentUsersProps> = ({ users }) => {
  const getRoleBadge = (role: 'student' | 'tutor') => {
    if (role === 'tutor') {
      return (
        <Badge variant="default" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
          Tutor
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
        Học viên
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Người dùng mới đăng ký
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có người dùng mới
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback>
                      {user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.fullName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                      {formatDistanceToNow(new Date(user.joinedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
                <div className="ml-2">
                  {getRoleBadge(user.role)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
