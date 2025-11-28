import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/config/axiosConfig";
import { Camera, Save, User, Mail, Phone, Calendar, MapPin, Globe, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { SafeAvatar } from "@/components/ui/safe-avatar";

// ================== VALIDATION ==================
const profileSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Định dạng email không hợp lệ"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  dob: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

// ==================================================

export const ProfileForm = () => {
  const { toast } = useToast();
  const { refreshUser } = useUser();
  const [userId, setUserId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newAvatarBase64, setNewAvatarBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState<string>("Male"); // State riêng cho gender (chỉ hiển thị)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // =============== Fetch user info ==================
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/users/myInfo");

        const user = res.data.result;
        setUserId(user.userID);
        setAvatarPreview(user.avatarURL);
        setGender(user.gender || "Male"); // Lưu gender vào state riêng

        reset({
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          country: user.country,
          address: user.address,
          bio: user.bio,
        });
      } catch (error) {
        console.error(" Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, [reset]);

  // ================== Update profile ==================
  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;
    setLoading(true);

    try {
      // CHỉ gửi các field được backend cho phép update
      const allowedFields: (keyof ProfileFormData)[] = [
        "fullName",
        "country",
        "address",
        "phone",
        "bio",
        "dob",
      ];

      const payload: Partial<ProfileFormData> & { avatarURL?: string } = {};

      allowedFields.forEach((key) => {
        if (data[key] !== undefined) {
          payload[key] = data[key];
        }
      });

      // Thêm avatar nếu có thay đổi
      if (newAvatarBase64) {
        payload.avatarURL = newAvatarBase64;
      }

      const res = await api.patch(`/users/${userId}`, payload);
      const updatedUser = res.data;

      reset({
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dob: updatedUser.dob,
        country: updatedUser.country,
        address: updatedUser.address,
        bio: updatedUser.bio,
      });

      setIsEditing(false);
      setNewAvatarBase64(null); // Reset avatar mới sau khi lưu thành công
      setAvatarPreview(updatedUser.avatarURL); // Cập nhật avatar từ server
      
      // Refresh user context để update header
      await refreshUser();
      
      toast({
        title: "Thành công!",
        description: "Cập nhật hồ sơ thành công!",
        variant: "default",
        duration: 3000,
      });
    } catch (error) {
      console.error(" Failed to update profile:", error);
      const errorMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Cập nhật thất bại!";
      toast({
        title: "Lỗi",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================== Cancel ==================
  const handleCancel = async () => {
    // Reset về dữ liệu gốc từ server
    try {
      const res = await api.get("/users/myInfo");
      const user = res.data.result;
      
      reset({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        country: user.country,
        address: user.address,
        bio: user.bio,
      });
      
      setAvatarPreview(user.avatarURL);
      setGender(user.gender || "Male"); // Reset gender
      setNewAvatarBase64(null); // Reset avatar mới
    } catch (error) {
      console.error("Failed to reset profile:", error);
    }
    
    setIsEditing(false);
  };

  // ================== Avatar upload ==================
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước ảnh không được vượt quá 2MB!",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh!",
        variant: "destructive",
      });
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = async () => {
      const MAX_WIDTH = 200;
      const MAX_HEIGHT = 200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      const base64String = canvas.toDataURL('image/jpeg', 0.5);
      
      if (base64String.length > 150000) {
        toast({
          title: "Lỗi",
          description: `Ảnh vẫn quá lớn (${Math.round(base64String.length / 1024)}KB). Vui lòng chọn ảnh khác!`,
          variant: "destructive",
        });
        return;
      }
      setAvatarPreview(base64String);
      setNewAvatarBase64(base64String);
      
      toast({
        title: "Đã chọn ảnh",
        description: "Nhấn 'Lưu thay đổi' để cập nhật ảnh đại diện",
        duration: 2000,
      });
    };

    img.src = URL.createObjectURL(file);
  };

  // ================== UI ==================
  return (
      <Card className="p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 pb-8 border-b-2 border-gray-100">
            <div className="relative group">
              <SafeAvatar
                src={avatarPreview}
                alt="User avatar"
                fallback="U"
                className="w-32 h-32 ring-4 ring-blue-100 transition-all group-hover:ring-blue-200"
                fallbackClassName="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold"
              />

              {isEditing && (
                  <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                  </label>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
              <p className="text-sm text-gray-500 mt-1">
                {isEditing ? "Đang chỉnh sửa hồ sơ" : "Xem và quản lý thông tin của bạn"}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Account Info Section */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Thông tin tài khoản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Tên đăng nhập
                  </label>
                  <Input {...register("username")} disabled className="bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    {...register("fullName")} 
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.fullName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        ⚠️ {errors.fullName.message}
                      </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </label>
                  <Input type="email" {...register("email")} disabled className="bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Số điện thoại
                  </label>
                  <Input 
                    {...register("phone")} 
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        ⚠️ {errors.phone.message}
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Ngày sinh
                  </label>
                  <Input 
                    type="date" 
                    {...register("dob")} 
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Giới tính
                  </label>
                  <select
                    value={gender}
                    disabled
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Quốc gia
                  </label>
                  <Input 
                    {...register("country")} 
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Địa chỉ
                  </label>
                  <Input 
                    {...register("address")} 
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Giới thiệu bản thân
              </h3>
              <div className="space-y-2">
                <Textarea 
                  {...register("bio")} 
                  disabled={!isEditing}
                  rows={5}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-100">
            {!isEditing ? (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>
            ) : (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    className="px-6 py-2 border-2 hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </Button>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? (
                        <>
                          <Save className="animate-spin w-4 h-4 mr-2" />
                          Đang lưu...
                        </>
                    ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Lưu thay đổi
                        </>
                    )}
                  </Button>
                </>
            )}
          </div>
        </form>
      </Card>
  );
};
