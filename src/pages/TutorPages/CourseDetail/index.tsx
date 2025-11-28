import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CourseDetailView } from '@/components/shared/CourseDetailView';
import { getCourseDetail } from './api';
import { getCourseListRoute } from '@/utils/course-routes';
import type { CourseDetail as Course } from '@/pages/Admin/CourseApproval/types';

export default function TutorCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const data = await getCourseDetail(courseId!);
      setCourse(data);
    } catch (error: any) {
      console.error('Error fetching course detail:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải thông tin khóa học",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourseDetailView
      course={course}
      loading={loading}
      backUrl={getCourseListRoute()}
      backLabel="Quay lại danh sách khóa học"
      showTutorActions={false}
      hideTutorInfo={true}
    />
  );
}