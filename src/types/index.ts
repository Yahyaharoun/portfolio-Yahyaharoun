export type Profile = {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  vision: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  role: "admin" | "editor";
  cv_mode?: "auto" | "manual";
  manual_cv_url?: string | null;
  manual_cv_updated_at?: string | null;
  stats_experience_years?: number;
  stats_projects_completed?: number;
};

export type Technology = {
  id: string;
  name: string;
  icon: string | null;
  category: "frontend" | "backend" | "database" | "devops" | "other" | null;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  type: string;
  context: string | null;
  solution: string | null;
  description: string | null;
  impact: string | null;
  demo_url: string | null;
  repo_url: string | null;
  cover_image_url: string | null;
  status: "en_cours" | "termine" | "archive";
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  architecture?: string | null;
  challenges?: string | null;
  results?: string | null;
  video_url?: string | null;
  article_id?: string | null;
  gallery_id?: string | null;
  technologies?: Technology[];
  project_images?: { id: string; image_url: string; caption: string | null }[];
};

export type Experience = {
  id: string;
  title: string;
  organization: string | null;
  type: "formation" | "entrepreneuriat" | "projet" | "stage" | "autre" | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  credential_url: string | null;
  image_url: string | null;
};

export type GalleryItem = {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: "image" | "video";
  category: string | null;
  is_published?: boolean;
  created_at?: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  content: string;
  external_url: string | null;
  avatar_url: string | null;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: "developpement" | "cybersecurite" | "ia" | "entrepreneuriat" | null;
  is_published: boolean;
  published_at: string | null;
  created_at?: string;
  read_time_minutes?: number;
  tags?: string[];
};

export type PartnershipRequest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  project_type: string;
  budget_range: string;
  description: string;
  attachment_url: string | null;
  status: "nouveau" | "en_cours" | "traite" | "archive";
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type CvData = {
  id: string;
  full_name: string;
  professional_title: string;
  summary: string | null;
  skills: string[];
  languages: { name: string; level: string }[];
  education: { title: string; institution: string; year: string }[];
};

export type Evolution = {
  id: string;
  title: string;
  organization: string;
  description: string | null;
  year: string;
  logo_url: string | null;
  document_url: string | null;
  sort_order: number;
  is_published: boolean;
  is_goal: boolean;
  created_at?: string;
};

export type Vision = {
  id: string;
  title: string;
  description: string;
  category: "valeur" | "afrique" | "ia" | "cybersecurite" | "entrepreneuriat" | "developpement" | "autre";
  icon_name: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
};
