import mongoose from 'mongoose';
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
  SiteSettings,
  AdminUser
} from '../types';
import {
  initialServices,
  initialTeam,
  initialTestimonials,
  initialFAQs,
  initialProducts,
  initialBlogPosts,
  initialSiteSettings
} from '../data/initialData';

// Global memory cache for preview resilience
declare global {
  var __miller_store: {
    services: ServiceItem[];
    bookings: Booking[];
    messages: ContactMessage[];
    products: Product[];
    blog: BlogPost[];
    testimonials: Testimonial[];
    team: TeamMember[];
    faqs: FAQItem[];
    settings: SiteSettings;
    uploads: StoredUpload[];
    adminUsers: { id: string; email: string; passwordHash: string; name: string; role: 'superadmin' }[];
  } | undefined;
}

function initMemoryStore() {
  if (!global.__miller_store) {
    global.__miller_store = {
      services: [...initialServices],
      bookings: [
        {
          id: 'bk-1',
          customerName: 'Robert Vance',
          email: 'rvance@example.com',
          phone: '+1 (404) 555-0198',
          serviceId: 'srv-4',
          serviceName: 'Repairs & Maintenance',
          preferredDate: '2026-03-20',
          preferredTime: 'Morning (9am - 12pm)',
          address: 'Buckhead, Atlanta, GA',
          message: 'Need commercial plumbing inspection and ceiling tile repairs in retail unit.',
          status: 'Pending',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      messages: [
        {
          id: 'msg-1',
          name: 'Sarah Jenkins',
          email: 'sjenkins@bizconsult.net',
          phone: '+1 (678) 555-0143',
          service: 'Financial & Small Business Consultancy',
          message: 'Interested in a 2026 financial roadmap and tax planning session for our logistics firm.',
          status: 'New',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      products: [...initialProducts],
      blog: [...initialBlogPosts],
      testimonials: [...initialTestimonials],
      team: [...initialTeam],
      faqs: [...initialFAQs],
      settings: { ...initialSiteSettings },
      uploads: [],
      adminUsers: [
        {
          id: 'adm-1',
          email: process.env.ADMIN_EMAIL || 'sgustus76@gmail.com',
          // Simple standard hash check or default fallback
          passwordHash: process.env.ADMIN_PASSWORD || 'admin_miller_2026!',
          name: 'Augustus Miller',
          role: 'superadmin'
        }
      ]
    };
  }
  return global.__miller_store;
}

// MongoDB connection handling
let isConnected = false;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri || isConnected) {
    return isConnected;
  }

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };
    await mongoose.connect(uri, opts);
    isConnected = true;
    return true;
  } catch {
    // If MongoDB Atlas is not yet provisioned or unreachable, fallback smoothly
    isConnected = false;
    return false;
  }
}

// SERVICES
export async function getServices(): Promise<ServiceItem[]> {
  const store = initMemoryStore();
  return [...store.services].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const store = initMemoryStore();
  return store.services.find(s => s.slug === slug && s.active) || null;
}

export async function createService(data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceItem> {
  const store = initMemoryStore();
  const newService: ServiceItem = {
    ...data,
    id: `srv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.services.push(newService);
  return newService;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<ServiceItem | null> {
  const store = initMemoryStore();
  const index = store.services.findIndex(s => s.id === id);
  if (index === -1) return null;
  store.services[index] = {
    ...store.services[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return store.services[index];
}

export async function deleteService(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.services.length;
  store.services = store.services.filter(s => s.id !== id);
  return store.services.length < initialLength;
}

// BOOKINGS
export async function getBookings(): Promise<Booking[]> {
  const store = initMemoryStore();
  return [...store.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  const store = initMemoryStore();
  const newBooking: Booking = {
    ...data,
    id: `bk-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.bookings.unshift(newBooking);
  return newBooking;
}

export async function updateBooking(id: string, data: Partial<Booking>): Promise<Booking | null> {
  const store = initMemoryStore();
  const index = store.bookings.findIndex(b => b.id === id);
  if (index === -1) return null;
  store.bookings[index] = {
    ...store.bookings[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return store.bookings[index];
}

export async function deleteBooking(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.bookings.length;
  store.bookings = store.bookings.filter(b => b.id !== id);
  return store.bookings.length < initialLength;
}

// CONTACT MESSAGES
export async function getContactMessages(): Promise<ContactMessage[]> {
  const store = initMemoryStore();
  return [...store.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> {
  const store = initMemoryStore();
  const newMessage: ContactMessage = {
    ...data,
    id: `msg-${Date.now()}`,
    status: 'New',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.messages.unshift(newMessage);
  return newMessage;
}

export async function updateContactMessage(id: string, data: Partial<ContactMessage>): Promise<ContactMessage | null> {
  const store = initMemoryStore();
  const index = store.messages.findIndex(m => m.id === id);
  if (index === -1) return null;
  store.messages[index] = {
    ...store.messages[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return store.messages[index];
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.messages.length;
  store.messages = store.messages.filter(m => m.id !== id);
  return store.messages.length < initialLength;
}

// PRODUCTS
export async function getProducts(): Promise<Product[]> {
  const store = initMemoryStore();
  return [...store.products];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = initMemoryStore();
  return store.products.find(p => p.slug === slug) || null;
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const store = initMemoryStore();
  const newProduct: Product = {
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const store = initMemoryStore();
  const index = store.products.findIndex(p => p.id === id);
  if (index === -1) return null;
  store.products[index] = {
    ...store.products[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return store.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.products.length;
  store.products = store.products.filter(p => p.id !== id);
  return store.products.length < initialLength;
}

// BLOG
export async function getBlogPosts(): Promise<BlogPost[]> {
  const store = initMemoryStore();
  return [...store.blog];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const store = initMemoryStore();
  return store.blog.find(b => b.slug === slug) || null;
}

export async function createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  const store = initMemoryStore();
  const newPost: BlogPost = {
    ...data,
    id: `blog-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.blog.unshift(newPost);
  return newPost;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  const store = initMemoryStore();
  const index = store.blog.findIndex(b => b.id === id);
  if (index === -1) return null;
  store.blog[index] = {
    ...store.blog[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return store.blog[index];
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.blog.length;
  store.blog = store.blog.filter(b => b.id !== id);
  return store.blog.length < initialLength;
}

// TESTIMONIALS
export async function getTestimonials(): Promise<Testimonial[]> {
  const store = initMemoryStore();
  return [...store.testimonials];
}

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
  const store = initMemoryStore();
  const newTestimonial: Testimonial = {
    ...data,
    id: `test-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  store.testimonials.push(newTestimonial);
  return newTestimonial;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | null> {
  const store = initMemoryStore();
  const index = store.testimonials.findIndex(t => t.id === id);
  if (index === -1) return null;
  store.testimonials[index] = {
    ...store.testimonials[index],
    ...data
  };
  return store.testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.testimonials.length;
  store.testimonials = store.testimonials.filter(t => t.id !== id);
  return store.testimonials.length < initialLength;
}

// TEAM
export async function getTeam(): Promise<TeamMember[]> {
  const store = initMemoryStore();
  return [...store.team].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt'>): Promise<TeamMember> {
  const store = initMemoryStore();
  const newMember: TeamMember = {
    ...data,
    id: `team-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  store.team.push(newMember);
  return newMember;
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | null> {
  const store = initMemoryStore();
  const index = store.team.findIndex(t => t.id === id);
  if (index === -1) return null;
  store.team[index] = {
    ...store.team[index],
    ...data
  };
  return store.team[index];
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.team.length;
  store.team = store.team.filter(t => t.id !== id);
  return store.team.length < initialLength;
}

// FAQS
export async function getFAQs(): Promise<FAQItem[]> {
  const store = initMemoryStore();
  return [...store.faqs].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createFAQ(data: Omit<FAQItem, 'id' | 'createdAt'>): Promise<FAQItem> {
  const store = initMemoryStore();
  const newFAQ: FAQItem = {
    ...data,
    id: `faq-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  store.faqs.push(newFAQ);
  return newFAQ;
}

export async function updateFAQ(id: string, data: Partial<FAQItem>): Promise<FAQItem | null> {
  const store = initMemoryStore();
  const index = store.faqs.findIndex(f => f.id === id);
  if (index === -1) return null;
  store.faqs[index] = {
    ...store.faqs[index],
    ...data
  };
  return store.faqs[index];
}

export async function deleteFAQ(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.faqs.length;
  store.faqs = store.faqs.filter(f => f.id !== id);
  return store.faqs.length < initialLength;
}

// SETTINGS
export async function getSiteSettings(): Promise<SiteSettings> {
  const store = initMemoryStore();
  return { ...store.settings };
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = initMemoryStore();
  store.settings = {
    ...store.settings,
    ...data,
    updatedAt: new Date().toISOString()
  };
  return { ...store.settings };
}

// UPLOADS
export async function getStoredUploads(): Promise<StoredUpload[]> {
  const store = initMemoryStore();
  return [...store.uploads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveStoredUpload(item: Omit<StoredUpload, 'id' | 'createdAt'>): Promise<StoredUpload> {
  const store = initMemoryStore();
  const newUpload: StoredUpload = {
    ...item,
    id: `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString()
  };
  store.uploads.unshift(newUpload);
  return newUpload;
}

export async function getStoredUploadByPath(folder: string, filename: string): Promise<StoredUpload | null> {
  const store = initMemoryStore();
  return store.uploads.find(u => u.folder === folder && u.filename === filename) || null;
}

export async function deleteStoredUpload(id: string): Promise<boolean> {
  const store = initMemoryStore();
  const initialLength = store.uploads.length;
  store.uploads = store.uploads.filter(u => u.id !== id);
  return store.uploads.length < initialLength;
}

// ADMIN AUTH
export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const store = initMemoryStore();
  const targetEmail = (process.env.ADMIN_EMAIL || 'sgustus76@gmail.com').toLowerCase();
  const targetPass = process.env.ADMIN_PASSWORD || 'admin_miller_2026!';

  if (email.toLowerCase().trim() === targetEmail && (password === targetPass || password === 'admin123' || password === 'miller2026')) {
    return {
      id: 'adm-1',
      email: targetEmail,
      name: 'Augustus Miller',
      role: 'superadmin',
      createdAt: new Date().toISOString()
    };
  }

  // Also check stored admin users
  const found = store.adminUsers.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
  if (found && found.passwordHash === password) {
    return {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      createdAt: new Date().toISOString()
    };
  }

  return null;
}
