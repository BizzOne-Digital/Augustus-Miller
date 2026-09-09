import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Miller Group of Company LLC | Professional Diversified Services',
  description: 'Delivering innovative, reliable, and high-quality professional services in business consultancy, property management, construction, repairs, handyman, transportation, and IT services in Metro Atlanta and Georgia.',
  openGraph: {
    title: 'Miller Group of Company LLC | One Group. Many Solutions.',
    description: 'Delivering innovative, reliable, and high-quality professional services across business consultancy, property management, general construction, repairs, handyman services, transportation, and IT services.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miller Group of Company LLC',
    description: 'One Group. Many Solutions. Endless Possibilities.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
