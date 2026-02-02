export interface TikTokVideo {
  link: string;
  pic_url: string;
  short_description: string;
  views_count: string;
  is_pinned: boolean;
}

export interface TikTokUserData {
  username: string;
  is_verified: boolean;
  fullname: string;
  avatar_url: string;
  followings: number;
  followers: number;
  likes: number;
  bio: string;
  external_url: string | null;
  videos?: TikTokVideo[];
}

export interface ScraperConfig {
  headless: boolean;
  defaultViewport?: {
    width: number;
    height: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
