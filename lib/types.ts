export type ServiceDivision = 
  | 'financial-consulting'
  | 'property-management'
  | 'construction'
  | 'repairs-maintenance'
  | 'handyman'
  | 'transportation'
  | 'it-services';

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  divisionSlogan: string;
  heroImage: string;
  iconName: string;
  accentColor: string;
  includedServices: string[];
  benefits: string[];
  process: {
    step: number;
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  featured: boolean;
  active: boolean;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rejected';

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  address: string;
  message: string;
  attachmentUrls?: string[];
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate?: string;
  message: string;
  status: MessageStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  images: string[];
  category: string;
  inventory: number;
  featured: boolean;
  active: boolean;
  comingSoon?: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'Draft' | 'Published';
  publishedAt: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerRole: string;
  company?: string;
  content: string;
  rating: number;
  serviceCategory: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
}

export interface StoredUpload {
  id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  dataBase64?: string;
  createdAt: string;
}

export interface SiteSettings {
  businessName: string;
  founderName: string;
  primaryPhone: string;
  primaryEmail: string;
  primaryAddress: string;
  serviceArea: string;
  businessHours: string;
  corporateMotto: string;
  supportingTagline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  mission: string;
  vision: string;
  footerText: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}
