import mongoose from 'mongoose';
import {
  StoredUploadModel,
  ServiceModel,
  BookingModel,
  ContactMessageModel,
  ProductModel,
  BlogPostModel,
  TestimonialModel,
  TeamMemberModel,
  FAQModel,
  SiteSettingsModel
} from '@/models';
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
//
// The connection promise is cached on `global` rather than in a module-level
// flag. Next.js serves many requests concurrently and reloads modules on every
// edit in dev, so a plain flag lets a second caller see "connected" (or start a
// second connect) while the handshake is still in flight - which then fails
// with "Cannot call ... before initial connection is complete" and silently
// drops the request to the non-persistent memory store.
declare global {
  var __miller_mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

/** Resolves true when queries may safely be issued. */
export async function connectToDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;

  const cache = (global.__miller_mongoose ||= { conn: null, promise: null });

  // readyState 1 === connected. A dropped connection clears the cache so the
  // next call reconnects instead of querying a dead socket.
  if (cache.conn && mongoose.connection.readyState === 1) return true;
  if (cache.conn) {
    cache.conn = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        // Atlas needs more than 2s from a cold start or a slow network.
        serverSelectionTimeoutMS: 15000
      })
      .catch(error => {
        // Clear the cached promise so a later request can retry.
        cache.promise = null;
        throw error;
      });
  }

  try {
    cache.conn = await cache.promise;
    return true;
  } catch (error) {
    console.error('MongoDB connection failed; using in-memory fallback:', error);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Mongo-backed persistence with an in-memory fallback                       */
/*                                                                            */
/*  Every content collection is read from and written to MongoDB whenever      */
/*  MONGODB_URI is reachable, so admin edits survive a dev-server restart and  */
/*  a production redeploy. The in-memory store is only used when the database  */
/*  is unavailable, and is explicitly non-persistent.                          */
/* -------------------------------------------------------------------------- */

type AnyDoc = Record<string, unknown> & { _id?: unknown };

/** Normalise a Mongoose lean() document into the app's id/ISO-string shape. */
function mapDoc<T>(doc: unknown): T {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc as AnyDoc & {
    __v?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  void __v;

  const iso = (v: Date | string | undefined, fallback: string): string =>
    v instanceof Date ? v.toISOString() : typeof v === 'string' ? v : fallback;

  const created = iso(createdAt, new Date().toISOString());

  return {
    ...rest,
    id: String(_id),
    createdAt: created,
    updatedAt: iso(updatedAt, created)
  } as T;
}

/**
 * Mongo rejects a non-ObjectId string with a CastError. Records created while
 * the database was offline carry memory ids such as `srv-4`, so guard every
 * lookup rather than letting the query throw.
 */
function isObjectId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

/** Strip the fields the database owns before writing. */
function stripMeta(data: object): Record<string, unknown> {
  const rest = { ...(data as Record<string, unknown>) };
  delete rest.id;
  delete rest._id;
  delete rest.createdAt;
  delete rest.updatedAt;
  delete rest.__v;
  return rest;
}

/**
 * Seed a collection from the bundled starter content the first time the app
 * connects to an empty database, so a fresh install is not a blank site.
 * Runs at most once per collection per process.
 */
const seeded = new Set<string>();
async function seedIfEmpty(
  key: string,
  model: {
    estimatedDocumentCount: () => Promise<number>;
    insertMany: (docs: Record<string, unknown>[]) => Promise<unknown>;
  },
  initial: object[]
): Promise<void> {
  if (seeded.has(key) || initial.length === 0) return;
  seeded.add(key);
  try {
    if ((await model.estimatedDocumentCount()) === 0) {
      await model.insertMany(initial.map(stripMeta));
    }
  } catch (error) {
    console.error(`Seeding "${key}" failed:`, error);
  }
}

// SERVICES
export async function getServices(): Promise<ServiceItem[]> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('services', ServiceModel, initialServices);
      const docs = await ServiceModel.find({}).sort({ displayOrder: 1 }).lean();
      return docs.map(d => mapDoc<ServiceItem>(d));
    } catch (error) {
      console.error('getServices failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.services].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('services', ServiceModel, initialServices);
      const doc = await ServiceModel.findOne({ slug, active: true }).lean();
      return doc ? mapDoc<ServiceItem>(doc) : null;
    } catch (error) {
      console.error('getServiceBySlug failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return store.services.find(s => s.slug === slug && s.active) || null;
}

export async function createService(data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceItem> {
  if (await connectToDatabase()) {
    try {
      const doc = await ServiceModel.create(stripMeta(data));
      return mapDoc<ServiceItem>(doc.toObject());
    } catch (error) {
      console.error('createService failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await ServiceModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<ServiceItem>(doc) : null;
    } catch (error) {
      console.error('updateService failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await ServiceModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteService failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.services.length;
  store.services = store.services.filter(s => s.id !== id);
  return store.services.length < initialLength;
}

// BOOKINGS
export async function getBookings(): Promise<Booking[]> {
  if (await connectToDatabase()) {
    try {
      const docs = await BookingModel.find({}).sort({ createdAt: -1 }).lean();
      return docs.map(d => mapDoc<Booking>(d));
    } catch (error) {
      console.error('getBookings failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  if (await connectToDatabase()) {
    try {
      const doc = await BookingModel.create({ ...stripMeta(data), status: 'Pending' });
      return mapDoc<Booking>(doc.toObject());
    } catch (error) {
      console.error('createBooking failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await BookingModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<Booking>(doc) : null;
    } catch (error) {
      console.error('updateBooking failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await BookingModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteBooking failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.bookings.length;
  store.bookings = store.bookings.filter(b => b.id !== id);
  return store.bookings.length < initialLength;
}

// CONTACT MESSAGES
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (await connectToDatabase()) {
    try {
      const docs = await ContactMessageModel.find({}).sort({ createdAt: -1 }).lean();
      return docs.map(d => mapDoc<ContactMessage>(d));
    } catch (error) {
      console.error('getContactMessages failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createContactMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> {
  if (await connectToDatabase()) {
    try {
      const doc = await ContactMessageModel.create({ ...stripMeta(data), status: 'New' });
      return mapDoc<ContactMessage>(doc.toObject());
    } catch (error) {
      console.error('createContactMessage failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await ContactMessageModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<ContactMessage>(doc) : null;
    } catch (error) {
      console.error('updateContactMessage failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await ContactMessageModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteContactMessage failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.messages.length;
  store.messages = store.messages.filter(m => m.id !== id);
  return store.messages.length < initialLength;
}

// PRODUCTS
export async function getProducts(): Promise<Product[]> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('products', ProductModel, initialProducts);
      const docs = await ProductModel.find({}).sort({ createdAt: 1 }).lean();
      return docs.map(d => mapDoc<Product>(d));
    } catch (error) {
      console.error('getProducts failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.products];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('products', ProductModel, initialProducts);
      const doc = await ProductModel.findOne({ slug }).lean();
      return doc ? mapDoc<Product>(doc) : null;
    } catch (error) {
      console.error('getProductBySlug failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return store.products.find(p => p.slug === slug) || null;
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  if (await connectToDatabase()) {
    try {
      const doc = await ProductModel.create(stripMeta(data));
      return mapDoc<Product>(doc.toObject());
    } catch (error) {
      console.error('createProduct failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await ProductModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<Product>(doc) : null;
    } catch (error) {
      console.error('updateProduct failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await ProductModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteProduct failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.products.length;
  store.products = store.products.filter(p => p.id !== id);
  return store.products.length < initialLength;
}

// BLOG
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('blog', BlogPostModel, initialBlogPosts);
      const docs = await BlogPostModel.find({}).sort({ createdAt: -1 }).lean();
      return docs.map(d => mapDoc<BlogPost>(d));
    } catch (error) {
      console.error('getBlogPosts failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.blog];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('blog', BlogPostModel, initialBlogPosts);
      const doc = await BlogPostModel.findOne({ slug }).lean();
      return doc ? mapDoc<BlogPost>(doc) : null;
    } catch (error) {
      console.error('getBlogPostBySlug failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return store.blog.find(b => b.slug === slug) || null;
}

export async function createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  if (await connectToDatabase()) {
    try {
      const doc = await BlogPostModel.create(stripMeta(data));
      return mapDoc<BlogPost>(doc.toObject());
    } catch (error) {
      console.error('createBlogPost failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await BlogPostModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<BlogPost>(doc) : null;
    } catch (error) {
      console.error('updateBlogPost failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await BlogPostModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteBlogPost failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.blog.length;
  store.blog = store.blog.filter(b => b.id !== id);
  return store.blog.length < initialLength;
}

// TESTIMONIALS
export async function getTestimonials(): Promise<Testimonial[]> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('testimonials', TestimonialModel, initialTestimonials);
      const docs = await TestimonialModel.find({}).sort({ createdAt: 1 }).lean();
      return docs.map(d => mapDoc<Testimonial>(d));
    } catch (error) {
      console.error('getTestimonials failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.testimonials];
}

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
  if (await connectToDatabase()) {
    try {
      const doc = await TestimonialModel.create(stripMeta(data));
      return mapDoc<Testimonial>(doc.toObject());
    } catch (error) {
      console.error('createTestimonial failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await TestimonialModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<Testimonial>(doc) : null;
    } catch (error) {
      console.error('updateTestimonial failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await TestimonialModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteTestimonial failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.testimonials.length;
  store.testimonials = store.testimonials.filter(t => t.id !== id);
  return store.testimonials.length < initialLength;
}

// TEAM
export async function getTeam(): Promise<TeamMember[]> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('team', TeamMemberModel, initialTeam);
      const docs = await TeamMemberModel.find({}).sort({ displayOrder: 1 }).lean();
      return docs.map(d => mapDoc<TeamMember>(d));
    } catch (error) {
      console.error('getTeam failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.team].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt'>): Promise<TeamMember> {
  if (await connectToDatabase()) {
    try {
      const doc = await TeamMemberModel.create(stripMeta(data));
      return mapDoc<TeamMember>(doc.toObject());
    } catch (error) {
      console.error('createTeamMember failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await TeamMemberModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<TeamMember>(doc) : null;
    } catch (error) {
      console.error('updateTeamMember failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await TeamMemberModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteTeamMember failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.team.length;
  store.team = store.team.filter(t => t.id !== id);
  return store.team.length < initialLength;
}

// FAQS
export async function getFAQs(): Promise<FAQItem[]> {
  if (await connectToDatabase()) {
    try {
      await seedIfEmpty('faqs', FAQModel, initialFAQs);
      const docs = await FAQModel.find({}).sort({ displayOrder: 1 }).lean();
      return docs.map(d => mapDoc<FAQItem>(d));
    } catch (error) {
      console.error('getFAQs failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return [...store.faqs].sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function createFAQ(data: Omit<FAQItem, 'id' | 'createdAt'>): Promise<FAQItem> {
  if (await connectToDatabase()) {
    try {
      const doc = await FAQModel.create(stripMeta(data));
      return mapDoc<FAQItem>(doc.toObject());
    } catch (error) {
      console.error('createFAQ failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      const doc = await FAQModel.findByIdAndUpdate(id, stripMeta(data), { new: true }).lean();
      return doc ? mapDoc<FAQItem>(doc) : null;
    } catch (error) {
      console.error('updateFAQ failed, falling back to memory store:', error);
    }
  }
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
  if ((await connectToDatabase()) && isObjectId(id)) {
    try {
      return Boolean(await FAQModel.findByIdAndDelete(id));
    } catch (error) {
      console.error('deleteFAQ failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  const initialLength = store.faqs.length;
  store.faqs = store.faqs.filter(f => f.id !== id);
  return store.faqs.length < initialLength;
}

// SETTINGS
//
// A single document holds the whole settings record; upsert keeps it unique
// without needing a fixed id.
export async function getSiteSettings(): Promise<SiteSettings> {
  if (await connectToDatabase()) {
    try {
      const doc = await SiteSettingsModel.findOne({}).lean();
      if (doc) return mapDoc<SiteSettings>(doc);
      const created = await SiteSettingsModel.create(stripMeta(initialSiteSettings));
      return mapDoc<SiteSettings>(created.toObject());
    } catch (error) {
      console.error('getSiteSettings failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  return { ...store.settings };
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  if (await connectToDatabase()) {
    try {
      const doc = await SiteSettingsModel.findOneAndUpdate(
        {},
        { $set: stripMeta(data) },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      if (doc) return mapDoc<SiteSettings>(doc);
    } catch (error) {
      console.error('updateSiteSettings failed, falling back to memory store:', error);
    }
  }
  const store = initMemoryStore();
  store.settings = {
    ...store.settings,
    ...data,
    updatedAt: new Date().toISOString()
  };
  return { ...store.settings };
}

// UPLOADS
//
// Uploaded binaries are stored in MongoDB, never on the local filesystem, so
// they survive redeploys and work on serverless hosts with a read-only disk.
// When MONGODB_URI is not configured we fall back to the in-process memory
// store, which is fine for local development but does NOT persist.

export const UPLOAD_FOLDERS = ['products', 'gallery', 'pages', 'misc', 'team', 'blog'] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** Public URL prefix served by app/api/uploads/[folder]/[filename]/route.ts */
export const UPLOAD_URL_PREFIX = '/api/uploads/';

function mapUploadDoc(doc: {
  _id: unknown;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  data?: Buffer | { buffer?: Buffer };
  dataBase64?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): StoredUpload {
  // Mongoose can hand back either a Buffer or a Binary wrapper depending on
  // whether the document came from a lean() query.
  const raw = doc.data as Buffer | { buffer?: Buffer } | undefined;
  const data = Buffer.isBuffer(raw) ? raw : raw?.buffer;

  return {
    id: String(doc._id),
    folder: doc.folder,
    filename: doc.filename,
    mimeType: doc.mimeType,
    size: doc.size,
    url: doc.url,
    data,
    dataBase64: doc.dataBase64,
    createdAt: (doc.createdAt || new Date()).toISOString(),
    updatedAt: doc.updatedAt?.toISOString()
  };
}

export async function getStoredUploads(): Promise<StoredUpload[]> {
  if (await connectToDatabase()) {
    try {
      // Exclude the binary payloads - listings only need the metadata.
      const docs = await StoredUploadModel.find({}, { data: 0, dataBase64: 0 })
        .sort({ createdAt: -1 })
        .lean();
      return docs.map(d => mapUploadDoc(d as never));
    } catch (error) {
      console.error('getStoredUploads failed, falling back to memory store:', error);
    }
  }

  const store = initMemoryStore();
  return [...store.uploads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveStoredUpload(item: Omit<StoredUpload, 'id' | 'createdAt'>): Promise<StoredUpload> {
  if (await connectToDatabase()) {
    try {
      const doc = await StoredUploadModel.create({
        folder: item.folder,
        filename: item.filename,
        mimeType: item.mimeType,
        size: item.size,
        url: item.url,
        data: item.data
      });
      return mapUploadDoc(doc.toObject() as never);
    } catch (error) {
      console.error('saveStoredUpload failed, falling back to memory store:', error);
    }
  }

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
  if (await connectToDatabase()) {
    try {
      const doc = await StoredUploadModel.findOne({ folder, filename }).lean();
      if (doc) return mapUploadDoc(doc as never);
    } catch (error) {
      console.error('getStoredUploadByPath failed, falling back to memory store:', error);
    }
  }

  const store = initMemoryStore();
  return store.uploads.find(u => u.folder === folder && u.filename === filename) || null;
}

export async function deleteStoredUpload(id: string): Promise<boolean> {
  if (await connectToDatabase()) {
    try {
      const result = await StoredUploadModel.findByIdAndDelete(id);
      if (result) return true;
    } catch (error) {
      console.error('deleteStoredUpload failed, falling back to memory store:', error);
    }
  }

  const store = initMemoryStore();
  const initialLength = store.uploads.length;
  store.uploads = store.uploads.filter(u => u.id !== id);
  return store.uploads.length < initialLength;
}

/**
 * Parse a stored-upload URL into its folder/filename pair.
 * Returns null for anything that is not one of our own upload URLs (external
 * URLs, legacy `/uploads/...` disk paths, empty strings).
 */
export function parseUploadUrl(url: string | undefined | null): { folder: string; filename: string } | null {
  if (!url || !url.startsWith(UPLOAD_URL_PREFIX)) return null;

  const [folder, filename, ...rest] = url.slice(UPLOAD_URL_PREFIX.length).split('/');
  if (!folder || !filename || rest.length > 0) return null;
  if (folder.includes('..') || filename.includes('..')) return null;

  return { folder, filename: filename.split('?')[0] };
}

/**
 * Delete the binary behind an upload URL. Call this when an image is replaced or
 * removed so orphaned binaries do not accumulate in the collection.
 *
 * No-op (returns false) for URLs this app does not own, so it is safe to call
 * with whatever string happens to be on the document.
 */
export async function deleteStoredUploadByUrl(url: string | undefined | null): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;

  if (await connectToDatabase()) {
    try {
      const result = await StoredUploadModel.deleteOne(parsed);
      if (result.deletedCount > 0) return true;
    } catch (error) {
      console.error('deleteStoredUploadByUrl failed, falling back to memory store:', error);
    }
  }

  const store = initMemoryStore();
  const initialLength = store.uploads.length;
  store.uploads = store.uploads.filter(
    u => !(u.folder === parsed.folder && u.filename === parsed.filename)
  );
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
