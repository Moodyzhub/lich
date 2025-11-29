import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguages } from '@/hooks/useLanguages';
import { CourseDetail } from '../types';

interface EditCourseInfoProps {
  course: CourseDetail;
  onSave: (data: Partial<CourseDetail>) => void;
  isSubmitting: boolean;
}

export default function EditCourseInfo({
  course,
  onSave,
  isSubmitting,
}: EditCourseInfoProps) {
  const { languages, isLoading: isLoadingLanguages, error: languageError, refetch: refetchLanguages } = useLanguages();
  
  const [formData, setFormData] = useState({
    title: course.title,
    shortDescription: course.shortDescription || '',
    description: course.description,
    requirement: course.requirement || '',
    level: course.level || 'BEGINNER',
    duration: course.duration,
    price: course.price,
    language: course.language,
    thumbnailURL: course.thumbnailURL,
    categoryID: course.categoryID,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'duration' || name === 'price' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter course title';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Please enter short description';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter course description';
    }
    if (!formData.requirement.trim()) {
      newErrors.requirement = 'Please enter course requirements';
    }
    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    if (!formData.level) {
      newErrors.level = 'Please select a level';
    }
    if (!formData.language.trim()) {
      newErrors.language = 'Please select a language';
    }
    if (!formData.thumbnailURL.trim()) {
      newErrors.thumbnailURL = 'Vui lòng nhập URL ảnh bìa';
    } else {
      // Validate URL format
      try {
        const url = new URL(formData.thumbnailURL);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          newErrors.thumbnailURL = 'URL phải bắt đầu bằng http:// hoặc https://';
        } else {
          // Validate image extension
          const pathname = url.pathname.toLowerCase();
          const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
          const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
          
          if (!hasValidExtension) {
            newErrors.thumbnailURL = 'URL phải là ảnh hợp lệ (JPG, PNG, WEBP, GIF)';
          }
        }
      } catch (error) {
        newErrors.thumbnailURL = 'URL không hợp lệ. Vui lòng nhập URL đầy đủ (VD: https://example.com/image.jpg)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Title */}
      <div>
        <Label htmlFor="title" className="text-base font-semibold mb-2">
          Tiêu đề khóa học <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="VD: Luyện thi IELTS toàn diện"
          disabled={isSubmitting}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <Label htmlFor="shortDescription" className="text-base font-semibold mb-2">
          Mô tả ngắn <span className="text-red-500">*</span>
        </Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Tóm tắt ngắn gọn về khóa học (tối đa 200 ký tự)"
          disabled={isSubmitting}
          maxLength={200}
          className={errors.shortDescription ? 'border-red-500' : ''}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.shortDescription.length}/200
        </p>
        {errors.shortDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
        )}
      </div>

      {/* Course Description */}
      <div>
        <Label htmlFor="description" className="text-base font-semibold mb-2">
          Mô tả khóa học <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Cung cấp mô tả chi tiết về khóa học của bạn..."
          rows={4}
          disabled={isSubmitting}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Requirement */}
      <div>
        <Label htmlFor="requirement" className="text-base font-semibold mb-2">
          Yêu cầu khóa học <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="requirement"
          name="requirement"
          value={formData.requirement}
          onChange={handleChange}
          placeholder="Liệt kê các yêu cầu để tham gia khóa học này..."
          rows={4}
          disabled={isSubmitting}
          className={errors.requirement ? 'border-red-500' : ''}
        />
        {errors.requirement && (
          <p className="text-red-500 text-sm mt-1">{errors.requirement}</p>
        )}
      </div>

      {/* Duration and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="duration" className="text-base font-semibold mb-2">
            Thời lượng (giờ) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            placeholder="VD: 40"
            disabled={isSubmitting}
            className={errors.duration ? 'border-red-500' : ''}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price" className="text-base font-semibold mb-2">
            Giá (VND) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="VD: 750000"
            disabled={isSubmitting}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>
      </div>

      {/* Level and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="level" className="text-base font-semibold mb-2">
            Cấp độ <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange('level', value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')}>
            <SelectTrigger disabled={isSubmitting} className={errors.level ? 'border-red-500' : ''}>
              <SelectValue placeholder="Chọn cấp độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Cơ bản</SelectItem>
              <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
              <SelectItem value="ADVANCED">Nâng cao</SelectItem>
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-red-500 text-sm mt-1">{errors.level}</p>
          )}
        </div>

        <div>
          <Label htmlFor="language" className="text-base font-semibold mb-2">
            Ngôn ngữ giảng dạy <span className="text-red-500">*</span>
          </Label>
          {languageError ? (
            <div className="space-y-2">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{languageError}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={refetchLanguages}
                className="w-full"
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              <Select 
                value={formData.language} 
                onValueChange={(value) => handleSelectChange('language', value)}
                disabled={isSubmitting || isLoadingLanguages}
              >
                <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
                  <SelectValue placeholder={isLoadingLanguages ? "Đang tải..." : "Chọn ngôn ngữ"} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.name}>
                      {lang.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-red-500 text-sm mt-1">{errors.language}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Thumbnail URL */}
      <div>
        <Label htmlFor="thumbnailURL" className="text-base font-semibold mb-2">
          URL ảnh bìa <span className="text-red-500">*</span>
        </Label>
        <Input
          id="thumbnailURL"
          name="thumbnailURL"
          value={formData.thumbnailURL}
          onChange={handleChange}
          placeholder="VD: https://example.com/image.jpg"
          disabled={isSubmitting}
          className={errors.thumbnailURL ? 'border-red-500' : ''}
        />
        <p className="text-xs text-gray-500 mt-1">
          Định dạng hỗ trợ: JPG, PNG, WEBP, GIF
        </p>
        {errors.thumbnailURL && (
          <p className="text-red-500 text-sm mt-1">{errors.thumbnailURL}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {isSubmitting ? 'Đang lưu...' : 'Tiếp tục'}
        </Button>
      </div>
    </form>
  );
}
