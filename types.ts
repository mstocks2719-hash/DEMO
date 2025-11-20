import { LucideIcon } from 'lucide-react';

export interface Post {
  id: string;
  headline: string;
  body: string;
  hashtags: string[];
  imagePrompt: string;
  imageUrl?: string;
  isGeneratingImage: boolean;
  posted: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  platform: string;
  posts: Post[];
  createdAt: Date;
}

export interface GeneratedImageResult {
  mimeType: string;
  base64: string;
}

export interface SocialAccount {
  platform: string;
  username: string;
  connected: boolean;
  icon: LucideIcon;
}

export interface StrategyResponse {
  campaignTitle: string;
  posts: {
    headline: string;
    body: string;
    hashtags: string[];
    imagePrompt: string;
  }[];
}