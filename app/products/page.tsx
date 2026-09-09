import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Tag, ShieldCheck, Mail } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getProducts } from '@/lib/db/db';

export const metadata = {
  title: 'Products & Equipment | Miller Group of Company LLC',
  description: 'Explore commercial equipment, safety gear, and specialized tools provided by Miller Group of Company LLC.'
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
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
              Professional Tools & Hardware
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Curated trade gear, commercial inspection kits, network hardware, and official Miller Group equipment engineered for durability and safety.
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
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#C8973E]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={prod.images[0] || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop'}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                      {prod.comingSoon && (
                        <div className="absolute top-3 left-3 bg-[#C8973E] text-[#0A2540] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                          Available for Order
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-[#0A2540] shadow-sm">
                        ${prod.price.toFixed(2)}
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
                      <span>Inquire / Request Purchase</span>
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
