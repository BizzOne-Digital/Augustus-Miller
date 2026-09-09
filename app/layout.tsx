import type {Metadata} from 'next';
import './globals.css'; // Global styles
import {getSiteSettings} from '@/lib/db/db';
import JsonLd from '@/components/site/JsonLd';
import {
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getSiteUrl
} from '@/lib/seo';

const SITE_DESCRIPTION =
  'Miller Group of Company LLC delivers innovative, reliable, and high-quality professional services in business consultancy, property management, general construction, repairs, handyman services, transportation, and IT services across Metro Atlanta and statewide Georgia.';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    // Pages supply their own short title; the brand suffix is appended here.
    default: `${SITE_NAME} | Professional Diversified Services`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{name: SITE_NAME}],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {telephone: true, email: true, address: true},
  openGraph: {
    type: 'website',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE.replace('-', '_'),
    url: getSiteUrl(),
    images: [{url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME}]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [DEFAULT_OG_IMAGE]
  },
  icons: {
    icon: [{ url: '/assets/Logo/logo.png', type: 'image/png' }],
    shortcut: ['/assets/Logo/logo.png'],
    apple: [{ url: '/assets/Logo/logo.png' }],
  },
  // NOTE: no `alternates.canonical` here on purpose - each page sets its own.
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  // Site-wide structured data. Read from the CMS so admin edits flow through.
  let settings = undefined;
  try {
    settings = await getSiteSettings();
  } catch {
    // Fall through to the defaults baked into the builders.
  }

  const organizationJsonLd = buildOrganizationJsonLd(settings ?? {});
  const webSiteJsonLd = buildWebSiteJsonLd(settings?.businessName || SITE_NAME);

  return (
    <html lang={DEFAULT_LOCALE}>
      <body suppressHydrationWarning>
        {children}
        {/* Site-level Organization/LocalBusiness + WebSite nodes */}
        <JsonLd data={[organizationJsonLd, webSiteJsonLd]} />
      </body>
    </html>
  );
}
