export type Author = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type CategoryWithCount = Category & { articleCount: number };

export type ArticleStatus = "DRAFT" | "PUBLISHED" | "HIDDEN";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: ArticleStatus;
  featured: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  category: Category | null;
  author: Author | null;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ArticleListResponse = {
  articles: Article[];
  pagination: Pagination;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
};