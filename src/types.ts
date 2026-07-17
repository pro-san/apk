export interface AITool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  category: string;
  rating: number;
  ratingCount: number;
  price: number;
  pricingType: 'free' | 'one-time' | 'subscription';
  billingPeriod?: 'monthly' | 'yearly';
  isFeatured: boolean;
  isTrending: boolean;
  iconName: string;
  bannerUrl?: string;
  gallery: string[];
  demoType: 'chat' | 'image' | 'copywriter' | 'video' | 'audio';
  documentation: string;
  reviewsCount: number;
  author: string;
  provider: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export interface Review {
  id: string;
  toolId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'in-progress' | 'closed';
  lastUpdated: string;
  messages: {
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }[];
}

export interface Order {
  id: string;
  toolId: string;
  toolName: string;
  toolIcon: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: 'stripe' | 'paypal';
  billingPeriod?: 'monthly' | 'yearly';
  type: 'free' | 'one-time' | 'subscription';
}

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: 'php' | 'javascript' | 'typescript' | 'json' | 'yaml' | 'markdown' | 'dockerfile';
}
