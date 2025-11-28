import axiosInstance from '@/config/axiosConfig';
import type { CourseDetail as Course } from '@/pages/Admin/CourseApproval/types';

/**
 * Get course detail for tutor
 * GET /tutor/courses/{courseId}/detail
 */
export const getCourseDetail = async (courseId: string): Promise<Course> => {
  try {
    const response = await axiosInstance.get(`/tutor/courses/${courseId}`);
    
    if (response.data.code !== 0) {
      throw new Error(response.data.message || 'Failed to fetch course detail');
    }

    const data = response.data.result || response.data || {};
    
    // Map objectives - handle both string[] and object[] formats
    const objectives = (data.objectives || []).map((item: any, index: number) => {
      // If item is already an object with objectiveText, use it
      if (typeof item === 'object' && item.objectiveText) {
        return {
          objectiveID: item.objectiveID || item.id || index + 1,
          objectiveText: item.objectiveText,
          orderIndex: item.orderIndex !== undefined ? item.orderIndex : index,
        };
      }
      // If item is a string, convert it to object format
      return {
        objectiveID: index + 1,
        objectiveText: typeof item === 'string' ? item : String(item),
        orderIndex: index,
      };
    });

    // Map admin notes from various possible field names
    const adminNotes = data.adminReviewNote || data.adminNotes || data.rejectionReason || data.reviewNote;

    return {
      ...data,
      objectives,
      courseID: data.id || courseId,
      adminNotes, // Map various backend field names
      section: data.sections || data.section || [], // Map sections field
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch course detail'
    );
  }
};

/**
 * Delete a course
 * DELETE /tutor/courses/{courseId}
 */
export const deleteCourse = async (courseId: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/tutor/courses/${courseId}`);

    if (response.data.code !== 0) {
      throw new Error(response.data.message || 'Failed to delete course');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to delete course'
    );
  }
};