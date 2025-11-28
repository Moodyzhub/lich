import { motion } from "framer-motion";
import { Filter, Star } from "lucide-react";

interface FiltersSectionProps {
  languages: string[];
  selectedLanguage: string;
  priceRange: [number, number];
  maxPrice: number;
  selectedRating: number;
  tutorCount: number;
  selectedDay: string;
  timeRange: [number, number];
  onLanguageChange: (value: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onDayChange: (day: string) => void;
  onTimeRangeChange: (range: [number, number]) => void;
}

const FiltersSection = ({
                          languages,
                          selectedLanguage,
                          priceRange,
                          maxPrice,
                          selectedRating,
                          tutorCount,
                          selectedDay,
                          timeRange,
                          onLanguageChange,
                          onPriceRangeChange,
                          onRatingChange,
                          onDayChange,
                          onTimeRangeChange,
                        }: FiltersSectionProps) => {
  const daysOfWeek = ["All", "T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const dayLabels: Record<string, string> = {
    "All": "Tất cả",
    "T2": "Thứ 2",
    "T3": "Thứ 3",
    "T4": "Thứ 4",
    "T5": "Thứ 5",
    "T6": "Thứ 6",
    "T7": "Thứ 7",
    "CN": "Chủ nhật"
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
      <section className="py-4 bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <motion.div
              className="space-y-3"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
          >
            {/* Single Row: All filters compact */}
            <div className="flex items-center justify-center gap-3 flex-nowrap overflow-x-auto">
              {/* FILTER LABEL */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Filter className="w-3.5 h-3.5 text-gray-600" />
                <span className="font-medium text-gray-700 text-xs">Bộ lọc:</span>
              </div>

              {/* === TEACHING LANGUAGE SELECT === */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Ngôn ngữ:
                </label>
                <select
                    value={selectedLanguage}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="border-2 border-gray-400 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {(languages ?? []).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                  ))}
                </select>
              </div>

              {/* === DAY OF WEEK FILTER === */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Thứ:
                </label>
                <select
                    value={selectedDay}
                    onChange={(e) => onDayChange(e.target.value)}
                    className="border-2 border-gray-400 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {dayLabels[day]}
                      </option>
                  ))}
                </select>
              </div>

              {/* === TIME RANGE FILTER === */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Giờ:
                </label>
                <div className="flex items-center gap-1">
                  <input
                      type="range"
                      min={0}
                      max={24}
                      value={timeRange[0]}
                      step={1}
                      onChange={(e) =>
                          onTimeRangeChange([Number(e.target.value), timeRange[1]])
                      }
                      className="w-20 accent-indigo-600"
                  />
                  <span className="text-xs text-gray-600 w-7">{String(timeRange[0]).padStart(2, '0')}h</span>
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                      type="range"
                      min={0}
                      max={24}
                      value={timeRange[1]}
                      step={1}
                      onChange={(e) =>
                          onTimeRangeChange([timeRange[0], Number(e.target.value)])
                      }
                      className="w-20 accent-indigo-600"
                  />
                  <span className="text-xs text-gray-600 w-7">{String(timeRange[1]).padStart(2, '0')}h</span>
                </div>
              </div>

              {/* === PRICE RANGE SLIDER (VND) === */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">
                  Giá:
                </label>
                <div className="flex items-center gap-1">
                  <input
                      type="range"
                      min={0}
                      max={maxPrice}
                      value={priceRange[0]}
                      step={1000}
                      onChange={(e) =>
                          onPriceRangeChange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-20 accent-indigo-600"
                  />
                  <span className="text-xs text-gray-600 w-10">{(priceRange[0]/1000).toFixed(0)}k</span>
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                      type="range"
                      min={0}
                      max={maxPrice}
                      value={priceRange[1]}
                      step={1000}
                      onChange={(e) =>
                          onPriceRangeChange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-20 accent-indigo-600"
                  />
                  <span className="text-xs text-gray-600 w-10">{(priceRange[1]/1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* === RATING FILTER === */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <label className="text-xs font-medium text-gray-600">Đánh giá:</label>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = selectedRating >= star;
                    return (
                        <button
                            key={star}
                            type="button"
                            onClick={() =>
                                onRatingChange(selectedRating === star ? 0 : star)
                            }
                        >
                          <Star
                              className={`w-3.5 h-3.5 ${
                                  active
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                              }`}
                          />
                        </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* === TUTOR COUNT - Row 2 === */}
            <div className="text-center text-sm text-gray-900">
              Tìm thấy <span className="font-semibold">{tutorCount}</span> gia sư
            </div>
          </motion.div>
        </div>
      </section>
  );
};

export default FiltersSection;
