
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Languages } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="w-full px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">
                Lingua<span className="text-blue-400">Hub</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Kết nối người học ngôn ngữ với người bản ngữ trên toàn thế giới. Thành thạo mọi ngôn ngữ với các bài học được cá nhân hóa.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Trang chủ</a></li>
              <li><a href="/tutors" className="text-gray-300 hover:text-blue-400 transition-colors">Tìm gia sư</a></li>
              <li><a href="/languages" className="text-gray-300 hover:text-blue-400 transition-colors">Khóa học</a></li>
              <li><a href="/apply-tutor" className="text-gray-300 hover:text-blue-400 transition-colors">Trở thành gia sư</a></li>
              <li><a href="/policy" className="text-gray-300 hover:text-blue-400 transition-colors">Chính sách</a></li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ngôn ngữ phổ biến</h3>
            <ul className="space-y-2">
              <li><a href="/languages" className="text-gray-300 hover:text-blue-400 transition-colors">Tiếng Anh</a></li>
              <li><a href="/languages" className="text-gray-300 hover:text-blue-400 transition-colors">Tiếng Nhật</a></li>
              <li><a href="/languages" className="text-gray-300 hover:text-blue-400 transition-colors">Tiếng Hàn</a></li>
              <li><a href="/languages" className="text-gray-300 hover:text-blue-400 transition-colors">Tiếng Trung</a></li>
              <li><a href="/languages" className="text-gray-300 hover:text-blue-400 transition-colors">Tiếng Pháp</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ với chúng tôi</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">hello@linguahub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2025 LinguaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;