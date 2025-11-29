import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Users, Package, DollarSign, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: BookOpen,
      label: 'Tạo khóa học',
      description: 'Tạo khóa học mới',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/tutor/courses/create'),
    },
    {
      icon: Calendar,
      label: 'Quản lý lịch',
      description: 'Xem và chỉnh sửa lịch',
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/tutor/schedule'),
    },
    {
      icon: Package,
      label: 'Gói dịch vụ',
      description: 'Quản lý các gói',
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/tutor/packages'),
    },
    {
      icon: Users,
      label: 'Học viên',
      description: 'Xem danh sách học viên',
      color: 'bg-teal-600 hover:bg-teal-700',
      onClick: () => navigate('/tutor/students'),
    },
    {
      icon: DollarSign,
      label: 'Thu nhập',
      description: 'Xem báo cáo thu nhập',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      onClick: () => navigate('/tutor/payment'),
    },
    {
      icon: Settings,
      label: 'Cài đặt',
      description: 'Cài đặt tài khoản',
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => navigate('/profile'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white rounded-lg p-4 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-center gap-2`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
