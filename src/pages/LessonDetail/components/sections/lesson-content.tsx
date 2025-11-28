import VideoLesson from '../lesson-types/video-lesson';
import ReadingLesson from '../lesson-types/reading-lesson';
import LessonWrapper from '../lesson-types/lesson-wrapper';

interface Material {
  id: number;
  title: string;
  type: string;
  size: string;
  url: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: number;
  lessonType: string;
  videoURL?: string | null;
  content?: string | null;
  transcript?: string | null;
  isDone?: boolean;
  materials: Material[];
}

interface LessonContentProps {
  lesson: Lesson;
  courseId: number;
}

const LessonContent = ({ lesson, courseId }: LessonContentProps) => {
  const type = lesson.lessonType?.trim().toLowerCase();

  const renderLessonContent = () => {
    switch (type) {
      case 'video':
        return (
          <VideoLesson
            videoURL={lesson.videoURL ?? null}
            materials={lesson.materials}
          />
        );

      case 'reading':
        return (
          <ReadingLesson
            duration={lesson.duration}
            content={lesson.content ?? null}
            transcript={lesson.transcript ?? null}
            materials={lesson.materials}
          />
        );

      default:
        return (
          <div className="text-center py-12 text-gray-600">
            Loại bài học không được hỗ trợ: {lesson.lessonType}
          </div>
        );
    }
  };

  return (
    <LessonWrapper
      lessonId={lesson.id}
      courseId={courseId}
      lessonType={lesson.lessonType}
      isDoneInitial={!!lesson.isDone}
    >
      {renderLessonContent()}
    </LessonWrapper>
  );
};

export default LessonContent;
