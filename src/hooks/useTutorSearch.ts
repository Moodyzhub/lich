import { useMemo } from 'react';
import MiniSearch from 'minisearch';

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

export const useTutorSearch = (tutors: Tutor[]) => {
  // Create MiniSearch instance
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch({
      fields: ['name', 'language', 'specialties', 'description', 'country'],
      storeFields: ['id', 'name', 'language', 'specialties', 'description'],
      searchOptions: {
        boost: {
          language: 3,      // Ưu tiên ngôn ngữ
          specialties: 2,   // Ưu tiên chuyên môn
          name: 1.5,
          description: 1,
          country: 0.5
        },
        fuzzy: 0.2,         // Chấp nhận 20% lỗi chính tả
        prefix: true,       // Hỗ trợ prefix search
        combineWith: 'AND'  // Tất cả từ phải match
      }
    });

    // Add tutors to index
    if (tutors.length > 0) {
      const indexData = tutors.map(tutor => ({
        id: tutor.id,
        name: tutor.name,
        language: tutor.language,
        specialties: tutor.specialties.join(' '),
        description: tutor.description,
        country: tutor.country
      }));

      ms.addAll(indexData);
    }

    return ms;
  }, [tutors]);

  // Search function
  const search = (query: string): number[] => {
    if (!query || query.trim() === '') {
      return tutors.map(t => t.id);
    }

    try {
      const results = miniSearch.search(query.trim());
      return results.map(r => r.id as number);
    } catch (error) {
      console.error('Search error:', error);
      return tutors.map(t => t.id);
    }
  };

  return { search };
};
