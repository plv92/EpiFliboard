
export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  source: string;
  sourceLogo: string;
  category: CategoryType;
  publishedAt: string;
  author: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
  url: string; // Lien vers l'article original
}

export enum CategoryType {
  NEWS = 'NEWS',
  TECH = 'TECH',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SPORTS = 'SPORTS',
  TRAVEL = 'TRAVEL',
  FOOD = 'FOOD',
  BUSINESS = 'BUSINESS',
  SCIENCE = 'SCIENCE'
}

export interface UserPreferences {
  favorites: CategoryType[];
  bookmarks: string[];
  readingHistory: string[];
}
