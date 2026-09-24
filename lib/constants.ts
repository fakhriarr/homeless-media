export const SITE_NAME = "MediaKita";
export const SITE_TAGLINE = "Portal Berita Terpercaya";
export const SITE_DESCRIPTION =
  "MediaKita adalah portal berita Indonesia yang menyajikan informasi nasional, ekonomi, olahraga, teknologi, hiburan, dan gaya hidup secara cepat dan terpercaya.";

export const ARTICLE_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  HIDDEN: "HIDDEN",
} as const;

export type ArticleStatus = (typeof ARTICLE_STATUS)[keyof typeof ARTICLE_STATUS];

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Terbit",
  HIDDEN: "Disembunyikan",
};

export const ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const AUTH_COOKIE = "mediakita_token";