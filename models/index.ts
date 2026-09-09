import mongoose, { Schema, Model } from 'mongoose';
import {
  ServiceItem,
  Booking,
  ContactMessage,
  Product,
  BlogPost,
  Testimonial,
  TeamMember,
  FAQItem,
  StoredUpload,
  SiteSettings
} from '../lib/types';

// Service Schema
const ServiceSchema = new Schema<ServiceItem>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  divisionSlogan: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  iconName: { type: String, default: 'Wrench' },
  accentColor: { type: String, default: '#C8973E' },
  includedServices: [{ type: String }],
  benefits: [{ type: String }],
  process: [{
    step: Number,
    title: String,
    description: String
  }],
  faq: [{
    question: String,
    answer: String
  }],
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, { timestamps: true });

// Booking Schema
const BookingSchema = new Schema<Booking>({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, default: 'Flexible' },
  address: { type: String, required: true },
  message: { type: String, default: '' },
  attachmentUrls: [{ type: String }],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Pending'
  },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

// Contact Message Schema
const ContactMessageSchema = new Schema<ContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, default: 'General Inquiry' },
  preferredDate: { type: String },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied', 'Archived'],
    default: 'New'
  },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

// Product Schema
const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  sku: { type: String, required: true, unique: true },
  images: [{ type: String }],
  category: { type: String, default: 'General' },
  inventory: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  comingSoon: { type: Boolean, default: false },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, { timestamps: true });

// Blog Post Schema
const BlogPostSchema = new Schema<BlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: String, default: 'Augustus Miller' },
  category: { type: String, default: 'Insights' },
  tags: [{ type: String }],
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
  publishedAt: { type: String, default: () => new Date().toISOString() },
  readTime: { type: String, default: '4 min read' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' }
}, { timestamps: true });

// Testimonial Schema
const TestimonialSchema = new Schema<Testimonial>({
  customerName: { type: String, required: true },
  customerRole: { type: String, default: 'Client' },
  company: { type: String, default: '' },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  serviceCategory: { type: String, default: 'General' },
  active: { type: Boolean, default: true },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

// Team Member Schema
const TeamMemberSchema = new Schema<TeamMember>({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String, required: true },
  photo: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// FAQ Schema
const FAQSchema = new Schema<FAQItem>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Stored Upload Schema.
// Binaries live in MongoDB rather than on disk so uploads survive redeploys and
// work on serverless hosts with a read-only filesystem (Vercel, Cloud Run).
const StoredUploadSchema = new Schema<StoredUpload>({
  folder: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  data: { type: Buffer, required: true },
  // Legacy records written before the Buffer migration.
  dataBase64: { type: String }
}, { timestamps: true });

// One document per (folder, filename); the pair is the public URL path.
StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

// Site Settings Schema
const SiteSettingsSchema = new Schema<SiteSettings>({
  businessName: { type: String, default: 'MILLER GROUP OF COMPANY LLC' },
  founderName: { type: String, default: 'Augustus Miller' },
  primaryPhone: { type: String, default: '+1 (770) 572-2022' },
  primaryEmail: { type: String, default: 'sgustus76@gmail.com' },
  primaryAddress: { type: String, default: 'Metro Atlanta, GA, USA' },
  serviceArea: { type: String, default: 'Metro Atlanta, Surrounding Counties, and Statewide Georgia' },
  businessHours: { type: String, default: 'Monday – Friday: 8:00 AM – 6:00 PM' },
  corporateMotto: { type: String, default: 'One Group. Many Solutions. Endless Possibilities.' },
  supportingTagline: { type: String, default: 'Building Solutions. Delivering Value.' },
  primaryCtaText: { type: String, default: 'Request a Quote' },
  secondaryCtaText: { type: String, default: 'Book a Service' },
  facebookUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  footerText: { type: String, default: '' }
}, { timestamps: true });

export const ServiceModel: Model<ServiceItem> = mongoose.models.Service || mongoose.model<ServiceItem>('Service', ServiceSchema);
export const BookingModel: Model<Booking> = mongoose.models.Booking || mongoose.model<Booking>('Booking', BookingSchema);
export const ContactMessageModel: Model<ContactMessage> = mongoose.models.ContactMessage || mongoose.model<ContactMessage>('ContactMessage', ContactMessageSchema);
export const ProductModel: Model<Product> = mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);
export const BlogPostModel: Model<BlogPost> = mongoose.models.BlogPost || mongoose.model<BlogPost>('BlogPost', BlogPostSchema);
export const TestimonialModel: Model<Testimonial> = mongoose.models.Testimonial || mongoose.model<Testimonial>('Testimonial', TestimonialSchema);
export const TeamMemberModel: Model<TeamMember> = mongoose.models.TeamMember || mongoose.model<TeamMember>('TeamMember', TeamMemberSchema);
export const FAQModel: Model<FAQItem> = mongoose.models.FAQ || mongoose.model<FAQItem>('FAQ', FAQSchema);
export const StoredUploadModel: Model<StoredUpload> = mongoose.models.StoredUpload || mongoose.model<StoredUpload>('StoredUpload', StoredUploadSchema);
export const SiteSettingsModel: Model<SiteSettings> = mongoose.models.SiteSettings || mongoose.model<SiteSettings>('SiteSettings', SiteSettingsSchema);
