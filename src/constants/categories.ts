export const CATEGORIES = [
  { id: 1, name: 'IELTS' },
  { id: 2, name: 'TOEIC' },
  { id: 3, name: 'JLPT' },
  { id: 4, name: 'TOPIK' },
  { id: 5, name: 'HSK' },
] as const;

export const LANGUAGES = [
  { id: 1, name: 'English', displayName: 'Tiếng Anh', code: 'en' },
  { id: 2, name: 'Vietnamese', displayName: 'Tiếng Việt', code: 'vi' },
  { id: 3, name: 'Japanese', displayName: 'Tiếng Nhật', code: 'ja' },
  { id: 4, name: 'Chinese', displayName: 'Tiếng Trung', code: 'zh' },
  { id: 5, name: 'Korean', displayName: 'Tiếng Hàn', code: 'ko' },
  { id: 6, name: 'French', displayName: 'Tiếng Pháp', code: 'fr' },
  { id: 7, name: 'Spanish', displayName: 'Tiếng Nga', code: 'ru' },
  { id: 8, name: 'German', displayName: 'Tiếng Đức', code: 'de' },
] as const;

export type Category = typeof CATEGORIES[number];
export type Language = typeof LANGUAGES[number];
