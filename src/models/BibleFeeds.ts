export interface BibleNewsItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  link: string;
  publishedAt: string;
  author?: string;
}

export interface BibleNewsFeedResponse {
  status: 'ok' | 'error';
  message?: string;
  feed: {
    title: string;
    link: string;
    description: string;
    image: string;
  };
  items: BibleNewsItem[];
}

export interface Rss2JsonItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure?: {
    link?: string;
    type?: string;
  };
  categories: string[];
}

export interface Rss2JsonResponse {
  status: 'ok' | 'error';
  message?: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: Rss2JsonItem[];
}