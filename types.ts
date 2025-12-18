
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

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
  commentsCount: number;
  isBookmarked: boolean;
  isLiked: boolean;
  url: string;
  comments?: Comment[];
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
  likes: string[];
  readingHistory: string[];
}
