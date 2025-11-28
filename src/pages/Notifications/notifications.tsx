import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/Notification';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

/**
 * Trang hiển thị tất cả thông báo
 */
const Notifications = () => {
  const navigate = useNavigate();
  
  // Lấy danh sách thông báo từ hook
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  
  // State để filter: 'all', 'unread', hoặc 'read'
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Lọc thông báo theo filter
  const filteredNotifications = 
    activeFilter === 'all' 
      ? notifications 
      : activeFilter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications.filter(n => n.isRead);
  
  const readCount = notifications.filter(n => n.isRead).length;

  /**
   * Lấy icon theo loại thông báo
   */
  const getNotificationIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    
    if (type.includes('CANCEL')) {
      return <Bell className={cn(iconClass, "text-red-500")} />;
    }
    if (type.includes('CONFIRMED')) {
      return <CheckCheck className={cn(iconClass, "text-green-500")} />;
    }
    if (type.includes('REMINDER')) {
      return <Bell className={cn(iconClass, "text-blue-500")} />;
    }
    if (type.includes('MESSAGE')) {
      return <Bell className={cn(iconClass, "text-purple-500")} />;
    }
    if (type.includes('COMPLETED') || type.includes('APPROVED')) {
      return <Check className={cn(iconClass, "text-green-500")} />;
    }
    
    return <Bell className={cn(iconClass, "text-gray-500")} />;
  };

  /**
   * Xử lý khi click vào thông báo
   */
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read nếu chưa đọc
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }
    
    // Nếu có link thì chuyển đến trang đó
    if (notification.primaryActionUrl) {
      navigate(notification.primaryActionUrl);
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Container lớn bao quanh toàn bộ */}
        <Card className="border-2 border-gray-300 shadow-xl bg-white">
          <div className="p-6 md:p-8">
            {/* Header - Tiêu đề và badge số lượng unread */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
                  <p className="text-gray-600 mt-1">
                    Cập nhật các hoạt động học tập của bạn
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    {unreadCount} mới
                  </Badge>
                )}
              </div>

              {/* Filters - Nút All, Unread và Read */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('all')}
                >
                  Tất cả ({notifications.length})
                </Button>
                <Button
                  variant={activeFilter === 'unread' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('unread')}
                >
                  Chưa đọc ({unreadCount})
                </Button>
                <Button
                  variant={activeFilter === 'read' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('read')}
                >
                  Đã đọc ({readCount})
                </Button>
              </div>
            </div>

            {/* Danh sách thông báo */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                // Không có thông báo
                <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                  <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không có thông báo
                  </h3>
                  <p className="text-gray-600">
                    {activeFilter === 'unread' 
                      ? "Bạn đã xem hết! Không có thông báo chưa đọc."
                      : activeFilter === 'read'
                        ? "Không có thông báo đã đọc."
                        : "Bạn chưa có thông báo nào."}
                  </p>
                </div>
              ) : (
                // Hiển thị từng thông báo
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.notificationId}
                    className={cn(
                      "p-5 cursor-pointer transition-all hover:shadow-lg border-2",
                      // Thông báo chưa đọc có màu xanh nhạt với viền xanh đậm
                      !notification.isRead 
                        ? "bg-blue-50/50 border-blue-300 hover:border-blue-400" 
                        : "bg-white border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      {/* Nội dung */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {notification.title}
                          </h3>
                          {/* Chấm xanh cho thông báo chưa đọc */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                        
                        {/* Hiển thị FULL content ở trang notifications */}
                        <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap break-words">
                          {notification.content}
                        </p>
                        
                        {/* Thời gian và loại */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), { 
                              addSuffix: true 
                            })}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                            {notification.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
