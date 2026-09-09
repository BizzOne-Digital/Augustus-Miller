import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/db/db';

/* -------------------------------------------------------------------------- */
/*  Site constants                                                            */
/* -------------------------------------------------------------------------- */

/** Locales this site publishes. Single-locale today; add entries to emit real hreflang. */
export const SITE_LOCALES = ['en-US'] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];
export const DEFAULT_LOCALE: SiteLocale = 'en-US';

export const SITE_NAME = 'Miller Group of Company LLC';
export const SITE_TAGLINE = 'One Group. Many Solutions. Endless Possibilities.';
export const DEFAULT_OG_IMAGE = '/assets/Logo/logo.png';

const FALLBACK_SITE_URL = 'http://localhost:3000';

export const SITE_KEYWORDS = [
  'Miller Group of Company LLC',
  'business consultancy Atlanta',
  'property rental management Georgia',
  'general construction contractor Georgia',
  'repairs and maintenance Atlanta',
  'handyman services Georgia',
  'transportation and logistics Georgia',
  'IT services Atlanta',
  'diversified services company',
  'Metro Atlanta contractors'
];

/* -------------------------------------------------------------------------- */
/*  Site URL                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Absolute origin of the site, with no trailing slash.
 *
 * Resolution order: NEXT_PUBLIC_SITE_URL -> VERCEL_PROJECT_PRODUCTION_URL ->
 * VERCEL_URL -> APP_URL -> localhost. Set NEXT_PUBLIC_SITE_URL in production so
 * canonicals point at the real domain rather than a per-deployment host.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.APP_URL
  ];

  for (const candidate of candidates) {
    const raw = candidate?.trim();
    if (!raw || raw.startsWith('MY_')) continue;
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      continue;
    }
  }

  return FALLBACK_SITE_URL;
}

/** Join a route path onto the site origin. `absoluteUrl('/about')` -> `https://host/about` */
export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === '/' ? '' : normalized.replace(/\/+$/, '')}`;
}

/** Resolve an image reference (relative or absolute) to an absolute URL. */
export function absoluteImageUrl(image?: string): string {
  const src = image?.trim() || DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(src);
}

/* -------------------------------------------------------------------------- */
/*  buildMetadata                                                             */
/* -------------------------------------------------------------------------- */

export interface BuildMetadataInput {
  title: string;
  description: string;
  /** BCP-47 locale for this document. Defaults to `en-US`. */
  locale?: string;
  /** Route path, e.g. `/services/construction`. Used for canonical + hreflang. */
  path: string;
  /** OG/Twitter image; relative paths are resolved against the site origin. */
  image?: string;
  noIndex?: boolean;
  /** Set for pages whose title already contains the brand, bypassing the layout template. */
  absoluteTitle?: boolean;
  /** Extra keywords merged with the site defaults. */
  keywords?: string[];
  /** `website` for landing pages, `article` for blog posts. */
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
}

/**
 * Build a complete Metadata object: canonical, hreflang alternates, Open Graph
 * and Twitter cards. Every page should call this (directly or through
 * `generatePageMetadata`) so the canonical is always page-specific.
 */
export function buildMetadata({
  title,
  description,
  locale = DEFAULT_LOCALE,
  path,
  image,
  noIndex = false,
  absoluteTitle = false,
  keywords,
  type = 'website',
  publishedTime,
  authors
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteImageUrl(image);

  // CMS-authored seoTitle values often already carry the brand. Treating those
  // as absolute stops the root layout template appending it a second time
  // ("Foo | Miller Group of Company LLC | Miller Group of Company LLC").
  const titleAlreadyBranded = /miller group/i.test(title);
  const useAbsoluteTitle = absoluteTitle || titleAlreadyBranded;

  // One entry per published locale, plus x-default pointing at the default one.
  const languages: Record<string, string> = {};
  for (const supported of SITE_LOCALES) {
    languages[supported] = canonical;
  }
  languages['x-default'] = canonical;

  return {
    title: useAbsoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords?.length ? [...SITE_KEYWORDS, ...keywords] : SITE_KEYWORDS,
    alternates: {
      canonical,
      languages
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale.replace('-', '_'),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article' && publishedTime ? { publishedTime, authors } : {})
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

/* -------------------------------------------------------------------------- */
/*  Page defaults + generatePageMetadata                                      */
/* -------------------------------------------------------------------------- */

export type PageKey =
  | 'home'
  | 'about'
  | 'services'
  | 'products'
  | 'contact'
  | 'faq'
  | 'booking'
  | 'testimonials'
  | 'team'
  | 'blog'
  | 'privacy'
  | 'terms';

interface PageSeoDefault {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  /** Title already carries the brand - skip the layout's `%s | Brand` template. */
  absoluteTitle?: boolean;
}

/**
 * Hardcoded fallbacks used when the CMS/DB has nothing for a page. These are the
 * last line of defence - `generatePageMetadata` prefers stored SiteSettings copy.
 */
const PAGE_DEFAULTS: Record<PageKey, PageSeoDefault> = {
  home: {
    title: `${SITE_NAME} | Professional Diversified Services`,
    absoluteTitle: true,
    description:
      'Miller Group of Company LLC delivers business consultancy, property management, general construction, repairs, handyman, transportation, and IT services across Metro Atlanta and statewide Georgia.',
    keywords: ['diversified services Georgia', 'Miller Group Atlanta']
  },
  about: {
    title: 'About Us',
    description:
      'Learn about Miller Group of Company LLC, our founder Augustus Miller, and our mission to provide diversified, reliable, and high-value professional services.',
    keywords: ['about Miller Group', 'Augustus Miller']
  },
  services: {
    title: 'Our 7 Core Services',
    description:
      'Explore the 7 professional divisions of Miller Group of Company LLC: business consulting, property management, construction, repairs, handyman, transportation, and IT services.',
    keywords: ['professional services Georgia']
  },
  products: {
    title: 'Products & Equipment',
    description:
      'Explore commercial equipment, safety gear, and specialized tools provided by Miller Group of Company LLC.',
    keywords: ['commercial equipment Georgia', 'safety gear supplier']
  },
  contact: {
    title: 'Contact Us',
    description:
      'Speak with Miller Group of Company LLC about a project, request a quote, or reach our Metro Atlanta team by phone or email. Statewide Georgia coverage.',
    keywords: ['contact Miller Group', 'request a quote Atlanta']
  },
  faq: {
    title: 'Frequently Asked Questions',
    description:
      'Find answers to common questions about Miller Group services, booking, quotes, service coverage, and warranties.',
    keywords: ['Miller Group FAQ']
  },
  booking: {
    title: 'Book a Service',
    description:
      'Book a service with Miller Group of Company LLC. Choose your division, pick a preferred date and time, and our team will confirm your appointment.',
    keywords: ['book a service Atlanta', 'schedule contractor Georgia']
  },
  testimonials: {
    title: 'Client Testimonials',
    description:
      'Read reviews and testimonials from business owners, landlords, and homeowners who trust Miller Group.',
    keywords: ['Miller Group reviews']
  },
  team: {
    title: 'Leadership & Team',
    description:
      'Meet Augustus Miller and the executive leadership team behind Miller Group of Company LLC.',
    keywords: ['Miller Group leadership team']
  },
  blog: {
    title: 'Blog & Industry Insights',
    description:
      'Expert articles, guides, and practical advice on property management, small business strategy, construction, and IT solutions.',
    keywords: ['construction insights Georgia']
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Privacy policy and data protection commitments of Miller Group of Company LLC.'
  },
  terms: {
    title: 'Terms of Service',
    description: 'Terms of service and customer agreements for Miller Group of Company LLC.'
  }
};
/**
 * Build page metadata from the CMS/DB where available, falling back to the
 * static defaults above. Never throws - if the datastore is unreachable the
 * static copy is used so the page still renders with valid metadata.
 */
export async function generatePageMetadata(
  pageKey: PageKey,
  locale: string = DEFAULT_LOCALE,
  path = '/'
): Promise<Metadata> {
  const fallback = PAGE_DEFAULTS[pageKey];

  let businessName = SITE_NAME;
  let cmsDescription: string | undefined;

  try {
    const settings = await getSiteSettings();
    if (settings?.businessName) businessName = settings.businessName;

    // Home leans on the CMS mission statement when one has been written.
    if (pageKey === 'home' && settings?.mission) {
      cmsDescription = settings.mission;
    }
    if (pageKey === 'about' && settings?.vision) {
      cmsDescription = `${fallback.description} ${settings.vision}`.trim();
    }
  } catch {
    // Datastore unavailable - static defaults below still produce valid metadata.
  }

  return buildMetadata({
    // Home carries the full brand title; inner pages inherit the layout template.
    title: fallback.title,
    absoluteTitle: fallback.absoluteTitle,
    description: truncate(cmsDescription || fallback.description, 300),
    locale,
    path,
    image: fallback.image,
    keywords: [...(fallback.keywords || []), businessName]
  });
}

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/* -------------------------------------------------------------------------- */
/*  noIndexMetadata                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Metadata for pages that must stay out of search results - admin, cart,
 * checkout, and account areas. Apply via a route-segment `layout.tsx` so every
 * nested page inherits it.
 */
export function noIndexMetadata(title = 'Restricted Area'): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      nosnippet: true,
      googleBot: { index: false, follow: false, noimageindex: true }
    }
  };
}

/* -------------------------------------------------------------------------- */
/*  JSON-LD structured data                                                   */
/* -------------------------------------------------------------------------- */

interface OrganizationInput {
  businessName?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  primaryAddress?: string;
  serviceArea?: string;
  businessHours?: string;
  founderName?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

/**
 * Organization + LocalBusiness graph node for the site root. LocalBusiness is a
 * subtype of Organization, so a single node typed as both keeps the graph small
 * while still qualifying for local rich results.
 */
export function buildOrganizationJsonLd(settings: OrganizationInput = {}) {
  const siteUrl = getSiteUrl();
  const sameAs = [settings.facebookUrl, settings.linkedinUrl, settings.instagramUrl]
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u));

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: settings.businessName || SITE_NAME,
    legalName: SITE_NAME,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteImageUrl(DEFAULT_OG_IMAGE)
    },
    image: absoluteImageUrl(DEFAULT_OG_IMAGE),
    slogan: SITE_TAGLINE,
    description:
      'Diversified professional services company providing business consultancy, property management, general construction, repairs, handyman services, transportation, and IT services.',
    telephone: settings.primaryPhone || '+1 (770) 572-2022',
    email: settings.primaryEmail || 'sgustus76@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.primaryAddress || 'Metro Atlanta, GA, USA',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: settings.serviceArea || 'Metro Atlanta and statewide Georgia'
    },
    openingHours: settings.businessHours || 'Mo-Fr 08:00-18:00',
    founder: {
      '@type': 'Person',
      name: settings.founderName || 'Augustus Miller'
    },
    ...(sameAs.length ? { sameAs } : {})
  };
}

/** WebSite graph node, wired to the organization above. */
export function buildWebSiteJsonLd(businessName = SITE_NAME) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: businessName,
    description: SITE_TAGLINE,
    inLanguage: DEFAULT_LOCALE,
    publisher: { '@id': `${siteUrl}/#organization` }
  };
}

interface ProductJsonLdInput {
  name: string;
  description: string;
  image?: string;
  price?: number;
  salePrice?: number;
  sku?: string;
  path: string;
  inStock?: boolean;
}

/** Product node with an Offer, for product detail pages and product listings. */
export function buildProductJsonLd(product: ProductJsonLdInput) {
  const url = absoluteUrl(product.path);
  const effectivePrice = product.salePrice ?? product.price;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: absoluteImageUrl(product.image),
    url,
    ...(product.sku ? { sku: product.sku } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    ...(typeof effectivePrice === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: effectivePrice.toFixed(2),
            priceCurrency: 'USD',
            availability: product.inStock === false
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
            seller: { '@id': `${getSiteUrl()}/#organization` }
          }
        }
      : {})
  };
}

/** FAQPage node built from question/answer pairs. */
export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

interface ServiceJsonLdInput {
  name: string;
  description: string;
  image?: string;
  path: string;
  areaServed?: string;
}

/** Service node for individual service division pages. */
export function buildServiceJsonLd(service: ServiceJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    ...(service.image ? { image: absoluteImageUrl(service.image) } : {}),
    provider: { '@id': `${getSiteUrl()}/#organization` },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: service.areaServed || 'Metro Atlanta and statewide Georgia'
    }
  };
}

/** ItemList wrapper, for listing pages that enumerate products or services. */
export function buildItemListJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path)
    }))
  };
}

interface BreadcrumbEntry {
  name: string;
  path: string;
}

/** BreadcrumbList node for nested pages. */
export function buildBreadcrumbJsonLd(entries: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path)
    }))
  };
}
