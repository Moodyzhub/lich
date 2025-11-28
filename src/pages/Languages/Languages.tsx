import React from "react";
import HeroSection from "./components/sections/hero-section";
import LanguagesGrid from "./components/sections/languages-grid";
import Pagination from "./components/sections/pagination";
import CTASection from "./components/sections/cta-section";

const Languages = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = 8;

  const languages = [
    {
      name: "English",
      flag: "🇺🇸",
      image: "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Dễ cho người mới",
      certificates: ["IELTS", "TOEFL", "Cambridge"],
      description: "Làm chủ ngôn ngữ toàn cầu cho công việc, du lịch và giao tiếp.",
      features: ["Hội thoại", "Viết", "Luyện thi", "Tiếng Anh thương mại"],
    },
    {
      name: "French",
      flag: "🇫🇷",
      image: "https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Trung bình",
      certificates: ["DELF", "DALF", "TCF"],
      description: "Khám phá ngôn ngữ của tình yêu, ngoại giao và văn hóa.",
      features: ["Văn hóa Pháp", "Tiếng Pháp thương mại", "Văn học", "Phát âm"],
    },
    {
      name: "Spanish",
      flag: "🇪🇸",
      image: "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Dễ",
      certificates: ["DELE", "SIELE"],
      description: "Nói một trong những ngôn ngữ được sử dụng rộng rãi nhất thế giới.",
      features: ["Giọng Latin", "Hội thoại", "Tiếng Tây Ban Nha thương mại", "Văn hóa"],
    },
    {
      name: "German",
      flag: "🇩🇪",
      image: "https://images.pexels.com/photos/109629/pexels-photo-109629.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Khó",
      certificates: ["TestDaF", "DSH", "Goethe"],
      description: "Ngôn ngữ của kỹ thuật, đổi mới và nghiên cứu.",
      features: ["Tiếng Đức thương mại", "Tập trung ngữ pháp", "Từ vựng kỹ thuật", "Văn hóa"],
    },
    {
      name: "Japanese",
      flag: "🇯🇵",
      image: "https://www.annees-de-pelerinage.com/wp-content/uploads/2019/07/senso-ji-temple-tokyo-japan.jpg",
      difficulty: "Rất khó",
      certificates: ["JLPT"],
      description: "Khám phá Nhật Bản qua ngôn ngữ và văn hóa.",
      features: ["Hiragana/Katakana", "Kanji", "Văn hóa Anime", "Mức độ lịch sự"],
    },
    {
      name: "Chinese (Mandarin)",
      flag: "🇨🇳",
      image: "https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Rất khó",
      certificates: ["HSK", "HSKK"],
      description: "Làm chủ ngôn ngữ được nói nhiều nhất thế giới.",
      features: ["Viết chữ Hán", "Pinyin", "Luyện nói", "Văn hóa"],
    },
    {
      name: "Korean",
      flag: "🇰🇷",
      image: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Khó",
      certificates: ["TOPIK"],
      description: "Học tiếng Hàn và khám phá K-pop & K-drama.",
      features: ["Viết Hangul", "Hội thoại", "Văn hóa K-pop", "Tiếng Hàn thương mại"],
    },
    {
      name: "Italian",
      flag: "🇮🇹",
      image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Trung bình",
      certificates: ["CILS", "CELI"],
      description: "Học ngôn ngữ của nghệ thuật, ẩm thực và âm nhạc.",
      features: ["Văn hóa", "Lịch sử nghệ thuật", "Thuật ngữ ẩm thực", "Hội thoại"],
    },
    {
      name: "Portuguese",
      flag: "🇵🇹",
      image: "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Dễ",
      certificates: ["CAPLE"],
      description: "Ngôn ngữ được nói ở Bồ Đào Nha và Brazil.",
      features: ["Giọng Brazil", "Hội thoại", "Từ vựng du lịch", "Văn hóa"],
    },
    {
      name: "Arabic",
      flag: "🇸🇦",
      image: "https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Rất khó",
      certificates: [],
      description: "Một trong những ngôn ngữ lâu đời và phong phú nhất thế giới.",
      features: ["Bảng chữ cái", "Phát âm", "Văn hóa", "Hội thoại"],
    },
    {
      name: "Thai",
      flag: "🇹🇭",
      image: "https://images.pexels.com/photos/2306291/pexels-photo-2306291.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Trung bình",
      certificates: [],
      description: "Học tiếng Thái và kết nối với văn hóa độc đáo của nó.",
      features: ["Luyện thanh điệu", "Hội thoại", "Từ vựng du lịch", "Văn hóa"],
    },
    {
      name: "Vietnamese",
      flag: "🇻🇳",
      image: "https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=800",
      difficulty: "Trung bình",
      certificates: [],
      description: "Học tiếng Việt dành cho người nước ngoài.",
      features: ["Phát âm", "Hệ thống thanh điệu", "Hội thoại hàng ngày", "Văn hóa"],
    },
  ];

  /**  Filter chỉ khi Search / Enter */
  const filteredLanguages = searchTerm.trim()
      ? languages.filter((lang) =>
          lang.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : languages;

  /**  Pagination */
  const totalPages = Math.ceil(filteredLanguages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLanguages = filteredLanguages.slice(startIndex, startIndex + itemsPerPage);

  /**  Reset về page 1 khi search */
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /**  Tự scroll về đầu trang khi đổi trang */
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
      <div className="min-h-screen bg-gray-50">
        <HeroSection setSearchTerm={setSearchTerm} />
        <LanguagesGrid languages={paginatedLanguages} />
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
        <CTASection />
      </div>
  );
};

export default Languages;
