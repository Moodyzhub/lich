import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, DollarSign, Clock, Trash2, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useLanguages } from '@/hooks/useLanguages';
import { CourseListItem } from '../course-list-api';
import { getStatusConfig, formatPrice } from '../utils';
import { createCourseDraft } from '../draft-course-api';
import { getCourseEditRoute, getCourseDraftEditRoute, getCourseDetailRoute } from '@/utils/course-routes';

interface CourseCardProps {
  course: CourseListItem;
  index: number;
  onDelete?: (courseId: number) => void;
  onEditApproved?: (courseId: number) => void;
  onToggleEnable?: (courseId: number, currentState: boolean) => Promise<void>;
  isToggling?: boolean;
}

export const CourseCard = ({ course, index, onDelete, onEditApproved, onToggleEnable, isToggling }: CourseCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languages } = useLanguages();
  const statusConfig = getStatusConfig(course.status);
  const StatusIcon = statusConfig.icon;
  
  // Check if course can be deleted (Draft or Rejected status)
  const canDelete = course.status === 'Draft' || course.status === 'Rejected';
  
  // Check if course is approved and needs confirmation for editing
  const isApproved = course.status === 'Approved';
  
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // State for draft creation
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  // Helper function to get Vietnamese display name for language
  const getLanguageDisplayName = (languageName?: string): string => {
    if (!languageName) return 'N/A';
    
    // Find the language in the fetched languages list
    const language = languages.find(lang => lang.name === languageName);
    
    // Return displayName if found, otherwise return the original name
    return language?.displayName || languageName;
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(course.id);
    }
  };
  
  const handleEditClick = async () => {
    if (isApproved) {
      // Check draft status first before showing dialog
      setIsCreatingDraft(true);
      
      try {
        // Create/get draft from approved course
        const draftData = await createCourseDraft(course.id);
        
        // Check draft status
        if (draftData.status === 'PENDING_REVIEW') {
          // Show toast warning if draft is pending review
          toast({
            variant: 'destructive',
            title: 'Không thể chỉnh sửa',
            description: 'Phiên bản cập nhật mới nhất của khóa học này đang được quản trị viên duyệt',
          });
          setIsCreatingDraft(false);
          return;
        }
        
        // Only allow editing if status is EDITING or REJECTED
        if (draftData.status === 'EDITING' || draftData.status === 'REJECTED') {
          // Show confirmation dialog
          setShowConfirmDialog(true);
        } else {
          toast({
            variant: 'destructive',
            title: 'Lỗi',
            description: 'Không thể chỉnh sửa khóa học này lúc này',
          });
        }
      } catch (error) {
        console.error('Error checking course draft:', error);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: error instanceof Error ? error.message : 'Không thể kiểm tra trạng thái khóa học. Vui lòng thử lại.',
        });
      } finally {
        setIsCreatingDraft(false);
      }
    } else {
      // Navigate directly for non-approved courses using React Router
      navigate(getCourseEditRoute(course.id));
    }
  };
  
  const handleConfirmEdit = async () => {
    // Prevent multiple clicks during loading
    if (isCreatingDraft) return;
    
    setIsCreatingDraft(true);
    
    try {
      // Create draft from approved course
      const draftData = await createCourseDraft(course.id);
      
      // Navigate to EditCourse with draft context using React Router
      navigate(getCourseDraftEditRoute(course.id, draftData.id), {
        state: {
          isDraft: true,
          draftData: draftData,
          originalCourseId: course.id
        }
      });
      
      // Call the onEditApproved callback if provided
      if (onEditApproved) {
        onEditApproved(course.id);
      }
      
      // Close dialog on success
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error creating course draft:', error);
      setDraftError(error instanceof Error ? error.message : 'Không thể tạo bản nháp. Vui lòng thử lại.');
    } finally {
      setIsCreatingDraft(false);
    }
  };
  
  const handleCancelEdit = () => {
    setShowConfirmDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-2 hover:border-blue-200">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={course.thumbnailURL || '/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`${statusConfig.className} border shadow-sm`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          
          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {course.categoryName}
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col p-5">
          {/* Course Header */}
          <div className="mb-4">
            <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
            
          </div>

          {/* Course Stats */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>Giá</span>
              </div>
              <span className="font-bold text-blue-600 text-base">
                {formatPrice(course.price)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Thời lượng</span>
              </div>
              <span className="font-medium">{course.duration} giờ</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>Ngôn ngữ</span>
              </div>
              <span className="font-medium text-xs">{getLanguageDisplayName(course.language)}</span>
            </div>
          </div>

          {/* Enable/Disable Toggle - Only for Approved courses */}
          {course.status === 'Approved' && (
            <div className="mb-4 pb-4 border-b">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={course.isEnabled ?? true}
                        onCheckedChange={() => onToggleEnable?.(course.id, course.isEnabled ?? true)}
                        disabled={isToggling}
                        aria-label={course.isEnabled ?? true ? 'Vô hiệu hóa khóa học' : 'Kích hoạt khóa học'}
                      />
                      <label className="text-sm font-medium">
                        {course.isEnabled ?? true ? 'Đang kích hoạt' : 'Đã vô hiệu hóa'}
                      </label>
                      {isToggling && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {course.isEnabled ?? true
                        ? 'Khóa học đang hiển thị cho học viên. Click để vô hiệu hóa.'
                        : 'Khóa học đang ẩn khỏi học viên. Click để kích hoạt.'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto space-y-2">
            {/* View Details Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full group/btn"
            >
              <Link to={getCourseDetailRoute(course.id)}>
                <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                Xem chi tiết
              </Link>
            </Button>

            {/* Manage Content Button */}
            <Button
              onClick={handleEditClick}
              variant="default"
              size="sm"
              className="w-full group/btn"
            >
              <BookOpen className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Chỉnh sửa 
            </Button>
            
            {/* Delete Button - Only show for Draft or Rejected courses */}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full group/btn"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Xóa khóa học
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa khóa học</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa khóa học "{course.title}"? 
                      Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Xóa khóa học
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog for Approved Course Editing */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Xác nhận chỉnh sửa khóa học"
        description={
          isCreatingDraft 
            ? "Đang tạo bản nháp..." 
            : "Bạn có chắc chắn muốn chỉnh sửa khóa học đã được duyệt không?"
        }
        confirmText={isCreatingDraft ? "Đang tạo..." : "OK"}
        cancelText="Hủy"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />
    </motion.div>
  );
};
