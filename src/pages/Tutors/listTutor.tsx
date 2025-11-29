import { useState, useEffect, useMemo } from "react";
import HeroSection from "./components/sections/hero-section";
import FiltersSection from "./components/sections/filters-section";
import TutorsGrid from "./components/sections/tutors-grid";
import Pagination from "./components/sections/pagination";
import api from "@/config/axiosConfig";
import { useTutorSearch } from "@/hooks/useTutorSearch";

interface Tutor {
  id: number;
  name: string;
  language: string;
  country: string;
  rating: number;
  reviews: number;
  price: number;
  specialties: string[];
  image: string;
  description: string;
  availability: string;
}

interface BookingPlan {
  booking_planid: number;
  tutor_id: number;
  title: string;
  start_hours: string;
  end_hours: string;
  is_open: boolean;
  is_active: boolean;
}

const Tutors = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [languages, setLanguages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 6;
  
  // Schedule filters
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 24]);
  const [tutorSchedules, setTutorSchedules] = useState<Record<number, BookingPlan[]>>({});

  /**  Fetch tutors from API */
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/tutors/approved");
        const data = Array.isArray(res.data.result) ? res.data.result : res.data;

        // Fetch detailed info for each tutor to get bio
        const detailedTutors = await Promise.all(
          data.map(async (tutor: any) => {
            try {
              const detailRes = await api.get(`/tutors/${tutor.tutorId}`);
              const detail = detailRes.data;
              const reviewCount = detail.feedbacks ? detail.feedbacks.length : 0;
              
              return {
                id: tutor.tutorId,
                name: tutor.userName,
                language: (tutor.teachingLanguage ?? "Unknown").trim(),
                country: tutor.country ?? "Unknown",
                rating: tutor.rating ?? 5.0,
                reviews: reviewCount,
                price: tutor.pricePerHour ?? 0,
                specialties: tutor.specialization ? tutor.specialization.split(",").map((s: string) => s.trim()) : [],
                image:
                    tutor.avatarUrl ||
                    tutor.avatarURL ||
                    "https://placehold.co/300x200?text=No+Image",
                description: detail.bio || "No bio available.",
                availability: tutor.availability ?? "Available",
              };
            } catch  {
              // Fallback if detail fetch fails
              return {
                id: tutor.tutorId,
                name: tutor.userName,
                language: (tutor.teachingLanguage ?? "Unknown").trim(),
                country: tutor.country ?? "Unknown",
                rating: tutor.rating ?? 5.0,
                reviews: 0,
                price: tutor.pricePerHour ?? 0,
                specialties: tutor.specialization ? tutor.specialization.split(",").map((s: string) => s.trim()) : [],
                image:
                    tutor.avatarUrl ||
                    tutor.avatarURL ||
                    "https://placehold.co/300x200?text=No+Image",
                description: "No bio available.",
                availability: tutor.availability ?? "Available",
              };
            }
          })
        );

        setTutors(detailedTutors);
        
        // Fetch booking plans for all tutors
        const schedules: Record<number, BookingPlan[]> = {};
        await Promise.all(
          detailedTutors.map(async (tutor) => {
            try {
              const planRes = await api.get(`/tutor/${tutor.id}/booking-plan`, { skipAuth: true });
              const plans: BookingPlan[] = planRes?.data?.plans || [];
              schedules[tutor.id] = plans.filter(p => p.is_open && p.is_active);
            } catch  {
              schedules[tutor.id] = [];
            }
          })
        );
        setTutorSchedules(schedules);

      } catch (error) {
        console.error(" Failed to fetch tutors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  /**  Update filter options when tutors fetched */
  useEffect(() => {
    if (tutors.length > 0) {
      const langs = Array.from(
          new Set(
              tutors.map((t) =>
                  (t.language || "Unknown").trim().replace(/\s+/g, " ")
              )
          )
      );
      
      // Map English names to Vietnamese for display
      const langMapping: Record<string, string> = {
        'English': 'Tiếng Anh',
        'Japanese': 'Tiếng Nhật',
        'Korean': 'Tiếng Hàn',
        'Chinese': 'Tiếng Trung',
        'French': 'Tiếng Pháp',
        'German': 'Tiếng Đức',
        'Spanish': 'Tiếng Tây Ban Nha',
        'Italian': 'Tiếng Ý',
        'Vietnamese': 'Tiếng Việt',
      };
      
      const mappedLangs = langs.map(lang => langMapping[lang] || lang);
      setLanguages(["Tất cả", ...mappedLangs]);

      const max = Math.max(...tutors.map((t) => t.price), 0);
      setMaxPrice(max);
      setPriceRange([0, max]);
    }
  }, [tutors]);

  // Initialize MiniSearch
  const { search } = useTutorSearch(tutors);

  /**  Compute filtered tutors using MiniSearch */
  const filteredTutors = useMemo(() => {
    // Step 1: Search with MiniSearch
    const searchResultIds = search(searchTerm);
    const searchFiltered = searchTerm.trim() === '' 
      ? tutors 
      : tutors.filter(t => searchResultIds.includes(t.id));

    // Step 2: Apply other filters
    const viToEnMapping: Record<string, string> = {
      'tất cả': 'all',
      'tiếng anh': 'english',
      'tiếng nhật': 'japanese',
      'tiếng hàn': 'korean',
      'tiếng trung': 'chinese',
      'tiếng pháp': 'french',
      'tiếng đức': 'german',
      'tiếng tây ban nha': 'spanish',
      'tiếng ý': 'italian',
      'tiếng việt': 'vietnamese',
    };
    
    const selectedLangLower = selectedLanguage.trim().toLowerCase();
    const selectedLang = viToEnMapping[selectedLangLower] || selectedLangLower;

    return searchFiltered.filter((tutor) => {
      const tutorLang = (tutor.language || "Unknown").trim().toLowerCase();

      const matchLanguage =
          selectedLang === "all" || tutorLang === selectedLang;
      
      // Schedule filter
      let matchSchedule = true;
      if (selectedDay !== "All") {
        const plans = tutorSchedules[tutor.id] || [];
        const dayPlans = plans.filter(p => p.title === selectedDay);
        
        if (dayPlans.length === 0) {
          matchSchedule = false;
        } else {
          // Check if any plan overlaps with selected time range
          const hasOverlap = dayPlans.some(plan => {
            const startHour = parseInt(plan.start_hours.split(':')[0]);
            const endHour = parseInt(plan.end_hours.split(':')[0]);
            // Check if plan time range overlaps with filter time range
            return !(endHour <= timeRange[0] || startHour >= timeRange[1]);
          });
          matchSchedule = hasOverlap;
        }
      }

      // Search is now handled by MiniSearch

      const matchPrice =
          tutor.price >= priceRange[0] && tutor.price <= priceRange[1];

      const matchRating = selectedRating === 0 || tutor.rating >= selectedRating;

      return matchLanguage && matchPrice && matchRating && matchSchedule;
    });
  }, [tutors, selectedLanguage, searchTerm, priceRange, selectedRating, selectedDay, timeRange, tutorSchedules, search]);

  /**  Reset page when filters change */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLanguage, searchTerm, priceRange, selectedRating, selectedDay, timeRange]);

  /**  Pagination logic */
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);
  const paginatedTutors = filteredTutors.slice(
      (currentPage - 1) * tutorsPerPage,
      currentPage * tutorsPerPage
  );

  /**  Auto reset if page > total */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  return (
      <div className="min-h-screen bg-gray-50">
        {/*  Hero Section */}
        <HeroSection
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
        />

        {/*  Filters */}
        <FiltersSection
            languages={languages}
            selectedLanguage={selectedLanguage}
            priceRange={priceRange}
            maxPrice={maxPrice}
            selectedRating={selectedRating}
            tutorCount={filteredTutors.length}
            selectedDay={selectedDay}
            timeRange={timeRange}
            onLanguageChange={(v) => {
              setSelectedLanguage(v);
              setCurrentPage(1);
              setPriceRange([0, maxPrice]);
            }}
            onPriceRangeChange={(range) => {
              setPriceRange(range);
              setCurrentPage(1);
            }}
            onRatingChange={(rating) => {
              setSelectedRating(rating);
              setCurrentPage(1);
            }}
            onDayChange={(day) => {
              setSelectedDay(day);
              setCurrentPage(1);
            }}
            onTimeRangeChange={(range) => {
              setTimeRange(range);
              setCurrentPage(1);
            }}
        />

        {/*  Tutors Grid */}
        <TutorsGrid tutors={paginatedTutors} loading={loading} />

        {/*  Pagination */}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
        />
      </div>
  );
};

export default Tutors;
