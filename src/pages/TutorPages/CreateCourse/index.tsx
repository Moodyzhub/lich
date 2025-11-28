import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step1CourseInfo } from './components/course-info';
import { CourseObjectives, type ObjectiveItem } from './components/course-objectives';
import CourseStructure from './components/course-structure';
import { CourseFormData, SectionData, courseApi, getCourseDetail, getObjectives } from '@/pages/TutorPages/CreateCourse/course-api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'createCourseProgress';

export default function CreateCourse() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize state from sessionStorage if available
  const getInitialState = () => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentStep: parsed.currentStep || 1,
          courseId: parsed.courseId || '',
          courseData: parsed.courseData || {},
          objectives: parsed.objectives || [],
          sections: parsed.sections || [],
        };
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
    return {
      currentStep: 1,
      courseId: '',
      courseData: {},
      objectives: [],
      sections: [],
    };
  };

  const initialState = getInitialState();
  const hasRestoredProgress = initialState.courseId !== '';

  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [courseId, setCourseId] = useState<string>(initialState.courseId);
  const [courseData, setCourseData] = useState<Partial<CourseFormData>>(initialState.courseData);
  const [objectives, setObjectives] = useState<ObjectiveItem[]>(initialState.objectives);
  const [sections, setSections] = useState<SectionData[]>(initialState.sections);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Show toast when progress is restored
  useEffect(() => {
    if (hasRestoredProgress) {
      toast({
        title: "Tiến trình đã được khôi phục",
        description: "Bạn có thể tiếp tục từ nơi đã dừng lại.",
        duration: 3000,
      });
    }
  }, []);

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Save progress to sessionStorage whenever state changes
  useEffect(() => {
    if (courseId) {
      const progressData = {
        currentStep,
        courseId,
        courseData,
        objectives,
        sections,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    }
  }, [currentStep, courseId, courseData, objectives, sections]);

  // Fetch data when navigating back to steps
  useEffect(() => {
    const fetchStepData = async () => {
      if (!courseId) return;

      setIsLoadingData(true);
      try {
        // Step 1: Fetch course info
        if (currentStep === 1) {
          const courseInfo = await getCourseDetail(courseId);
          setCourseData(courseInfo);
        }

        // Step 2: Fetch objectives
        if (currentStep === 2) {
          const objectivesData = await getObjectives(courseId);
          const formattedObjectives = objectivesData.map((obj: any) => ({
            id: obj.objectiveID?.toString() || obj.id?.toString(),
            objectiveText: obj.objectiveText,
            orderIndex: obj.orderIndex,
          }));
          setObjectives(formattedObjectives);
        }

        // Step 3: Keep sections in state (no API fetch)
        // Sections will only be saved to DB when user clicks "Submit"
      } catch (err) {
        console.error('Error fetching step data:', err);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu. Vui lòng thử lại.',
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchStepData();
  }, [currentStep, courseId]);

  const handleStep1Next = async (data: CourseFormData) => {
    try {
      if (courseId) {
        // Course already exists, update it
        // Note: You may need to add an updateCourse API function if needed
        // For now, just save to state and move to next step
        setCourseData(data);
        setCurrentStep(2);
        return;
      }

      // Create new course
      const { courseId: newCourseId } = await courseApi.createCourse(data);
      setCourseId(newCourseId);
      setCourseData(data);
      setCurrentStep(2);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể tạo khóa học',
      });
    }
  };

  const handleStep1aNext = async (objectivesList: ObjectiveItem[]) => {
    try {
      // Save objectives to backend and collect response IDs
      const updatedObjectives: ObjectiveItem[] = [];
      
      for (const objective of objectivesList) {
        if (!objective.id) {
          // Only add new objectives (those without id)
          const response = await courseApi.addObjective(courseId, {
            objectiveText: objective.objectiveText,
            orderIndex: objective.orderIndex,
          });
          // Store the returned objectiveId from API
          updatedObjectives.push({
            ...objective,
            id: response.objectiveId,
          });
        } else {
          // Keep existing objectives with their IDs
          updatedObjectives.push(objective);
        }
      }
      
      setObjectives(updatedObjectives);
      setCurrentStep(3); // Move to Course Content
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không thể lưu mục tiêu học tập',
      });
    }
  };

  const handleStep1aBack = () => {
    setCurrentStep(1);
  };

  const handleStep2Save = async (sectionsData: SectionData[]) => {
    // Save sections to state first
    setSections(sectionsData);

    try {
      // Validate all data before creating
      for (const section of sectionsData) {
        if (!section.title?.trim()) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: 'Tiêu đề chương là bắt buộc',
          });
          return;
        }
        
        if (section.lessons.length === 0) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: `Chương "${section.title}" phải có ít nhất một bài học`,
          });
          return;
        }

        for (const lesson of section.lessons) {
          if (!lesson.title?.trim()) {
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: 'Tiêu đề bài học là bắt buộc',
            });
            return;
          }

          if (lesson.resources && lesson.resources.length > 0) {
            for (const resource of lesson.resources) {
              if (!resource.resourceTitle?.trim()) {
                toast({
                  variant: "destructive",
                  title: "Lỗi",
                  description: 'Tiêu đề tài nguyên là bắt buộc',
                });
                return;
              }
              if (!resource.resourceURL?.trim()) {
                toast({
                  variant: "destructive",
                  title: "Lỗi",
                  description: 'URL tài nguyên là bắt buộc',
                });
                return;
              }
              if (!isValidUrl(resource.resourceURL)) {
                toast({
                  variant: "destructive",
                  title: "Lỗi",
                  description: `URL tài nguyên không hợp lệ: "${resource.resourceURL}". Phải bắt đầu bằng http:// hoặc https://`,
                });
                return;
              }
            }
          }
        }
      }

      // All validation passed, proceed with API creation
      toast({
        title: "Đang xử lý...",
        description: "Đang tạo nội dung khóa học...",
        duration: 2000,
      });

      // Create sections, lessons, and resources via API
      for (const section of sectionsData) {
        let sectionId: string = '';
        try {
          const result = await courseApi.addSection(courseId, {
            courseID: parseInt(courseId),
            title: section.title,
            description: section.description,
            orderIndex: section.orderIndex,
          });
          sectionId = result.sectionId;
        } catch (sectionErr) {
          throw new Error(`Không thể tạo chương "${section.title}": ${sectionErr instanceof Error ? sectionErr.message : 'Lỗi không xác định'}`);
        }

        for (const lesson of section.lessons) {
          let lessonId: string = '';
          try {
            const result = await courseApi.addLesson(courseId, sectionId, {
              title: lesson.title,
              duration: lesson.duration,
              lessonType: lesson.lessonType || 'Video',
              videoURL: lesson.videoURL,
              content: lesson.content,
              orderIndex: lesson.orderIndex,
            });
            lessonId = result.lessonId;
          } catch (lessonErr) {
            throw new Error(`Không thể tạo bài học "${lesson.title}": ${lessonErr instanceof Error ? lessonErr.message : 'Lỗi không xác định'}`);
          }

          if (lesson.resources && lesson.resources.length > 0) {
            for (const resource of lesson.resources) {
              try {
                await courseApi.addLessonResource(courseId, sectionId, lessonId, {
                  resourceType: resource.resourceType,
                  resourceTitle: resource.resourceTitle,
                  resourceURL: resource.resourceURL,
                });
              } catch (resourceErr) {
                throw new Error(`Không thể thêm tài nguyên "${resource.resourceTitle}": ${resourceErr instanceof Error ? resourceErr.message : 'Lỗi không xác định'}`);
              }
            }
          }
        }
      }

      toast({
        title: "Thành công!",
        description: "Nội dung khóa học đã được lưu! Đang gửi khóa học...",
        duration: 2000,
      });

      // Submit course for approval
      const submitResult = await courseApi.submitCourse(courseId);

      if (submitResult.success && (submitResult.status.toLowerCase() === 'pending' || submitResult.status.toLowerCase() === 'draft')) {
        // Clear saved progress after successful submission
        sessionStorage.removeItem(STORAGE_KEY);
        setShowSuccessModal(true);
      } else {
        throw new Error(`Gửi thất bại: Trạng thái không hợp lệ ${submitResult.status}`);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err instanceof Error ? err.message : 'Không thể lưu nội dung khóa học',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.TUTOR_COURSES)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách khóa học
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">Tạo khóa học mới</h1>
          <p className="mt-2 text-sm text-gray-600">
            Chia sẻ kiến thức của bạn bằng cách tạo một khóa học hấp dẫn
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
                </div>
                <span className="mt-2 text-sm font-medium text-center">Thông tin</span>
              </div>

              <div
                className={`h-1 flex-1 mx-4 ${
                  currentStep > 1 ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === 2
                      ? 'bg-blue-500 text-white'
                      : currentStep > 2
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle2 className="w-6 h-6" /> : '2'}
                </div>
                <span className="mt-2 text-sm font-medium text-center">Mục tiêu</span>
              </div>

              <div
                className={`h-1 flex-1 mx-4 ${
                  currentStep > 2 ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === 3
                      ? 'bg-blue-500 text-white'
                      : currentStep > 3
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span className="mt-2 text-sm font-medium text-center">Nội dung</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            {/* <CardTitle>
              {currentStep === 1
                ? 'Step 1: Basic Information'
                : currentStep === 2
                ? 'Step 2: Learning Objectives'
                : 'Step 3: Course Structure'}
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <Step1CourseInfo
                    data={courseData}
                    onNext={handleStep1Next}
                  />
                )}

                {currentStep === 2 && (
                  <CourseObjectives
                    objectives={objectives}
                    onNext={handleStep1aNext}
                    onBack={handleStep1aBack}
                    onDeleteObjective={async (objectiveId: string) => {
                      await courseApi.deleteObjective(objectiveId);
                    }}
                  />
                )}

                {currentStep === 3 && (
                  <CourseStructure
                    sections={sections}
                    onSectionsChange={setSections}
                    onSave={handleStep2Save}
                    onBack={() => setCurrentStep(2)}
                    isSubmitting={false}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md border-0 shadow-lg">
          <DialogHeader className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              🎉 Tạo khóa học thành công!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Khóa học của bạn đang chờ quản trị viên phê duyệt.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Tên khóa học</p>
              <p className="font-semibold text-gray-900 text-lg">{courseData.title}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <p className="font-semibold text-blue-600">Đang chờ duyệt</p>
            </div>
          </div>

          <DialogFooter className="flex gap-3 mt-6">
            <Button
              onClick={() => navigate(ROUTES.TUTOR_COURSES)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
