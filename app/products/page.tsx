import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Tag, ShieldCheck, Mail } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getProducts } from '@/lib/db/db';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, buildItemListJsonLd, buildProductJsonLd, generatePageMetadata } from '@/lib/seo';
import JsonLd from '@/components/site/JsonLd';
import { resolveImageSrc } from '@/lib/images';


// Admin edits must show up on the public site immediately, so this route is
// rendered per request instead of being cached at build time.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('products', DEFAULT_LOCALE, '/products');
}

export default async function ProductsPage() {
  const products = await getProducts();
  const activeProducts = products.filter(p => p.active !== false);

  // There is no /products/[slug] route, so each Product node points at its
  // anchor on this listing page.
  const productNodes = activeProducts.map(p =>
    buildProductJsonLd({
      name: p.name,
      description: p.shortDescription || p.description,
      image: p.images?.[0],
      // Pre-launch products carry no Offer: advertising a price for something
      // that cannot be bought yet is misleading in search results.
      price: p.comingSoon ? undefined : p.price,
      salePrice: p.comingSoon ? undefined : p.salePrice,
      sku: p.sku,
      path: `/products#${p.slug}`,
      inStock: !p.comingSoon && (p.inventory ?? 0) > 0
    })
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      {productNodes.length > 0 && (
        <JsonLd
          data={[
            ...productNodes,
            buildItemListJsonLd(
              activeProducts.map(p => ({ name: p.name, path: `/products#${p.slug}` }))
            )
          ]}
        />
      )}
      <Header />

      <main className="flex-1">
        {/* Products Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2000&auto=format&fit=crop"
            alt="Miller Group Professional Equipment"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Division Products & Equipment
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Featured Products
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Coming soon — tools, equipment, digital services, and more. Register your interest below and we will contact you as items become available.
            </p>
          </div>
        </section>

        {/* Products Catalog */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  id={prod.slug}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#C8973E]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group scroll-mt-28"
                >
                  <div>
                    <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={resolveImageSrc(prod.images?.[0], 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop')}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                      <div
                        className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm ${
                          prod.comingSoon
                            ? 'bg-[#0A2540] text-[#DFC37C]'
                            : 'bg-[#C8973E] text-[#0A2540]'
                        }`}
                      >
                        {prod.comingSoon ? 'Coming Soon' : 'Available for Order'}
                      </div>
                      {/* Price is indicative only while a product is pre-launch. */}
                      <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-[#0A2540] shadow-sm">
                        {prod.comingSoon ? 'Price on request' : `$${prod.price.toFixed(2)}`}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Tag className="w-3.5 h-3.5 text-[#C8973E]" />
                        <span>{prod.category}</span>
                        <span>•</span>
                        <span>SKU: {prod.sku}</span>
                      </div>

                      <h2 className="font-serif font-bold text-lg text-[#0A2540] group-hover:text-[#C8973E] transition-colors">
                        {prod.name}
                      </h2>

                      <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {prod.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/contact?service=Equipment-Inquiry&product=${encodeURIComponent(prod.name)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0A2540] hover:bg-[#153a63] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#DFC37C]" />
                      <span>{prod.comingSoon ? 'Register Interest' : 'Inquire / Request Purchase'}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
