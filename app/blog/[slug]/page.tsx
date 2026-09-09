import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/db/db';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found | Miller Group' };
  return {
    title: post.seoTitle || `${post.title} | Miller Group Insights`,
    description: post.seoDescription || post.excerpt
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <article className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A2540] hover:text-[#C8973E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles & Insights</span>
            </Link>

            <div className="space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-[#C8973E]/15 border border-[#C8973E]/30 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                {post.category}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-[#0A2540] leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
                <span className="font-semibold text-slate-800">By {post.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C8973E]" />
                  {post.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C8973E]" />
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content Body */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
              <p className="text-lg font-medium text-[#0A2540] leading-relaxed border-l-4 border-[#C8973E] pl-4 italic">
                {post.excerpt}
              </p>

              <div className="space-y-4 text-base whitespace-pre-line">
                {post.content}
              </div>
            </div>

            {/* Author Box */}
            <div className="bg-[#0A2540] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border border-[#C8973E]/30">
              <div className="w-16 h-16 rounded-full bg-[#C8973E] text-[#0A2540] flex items-center justify-center font-bold text-xl shrink-0">
                AM
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-[#DFC37C] tracking-widest uppercase">
                  Written By
                </span>
                <h3 className="font-serif font-bold text-lg text-white">{post.author}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Founder & CEO of Miller Group of Company LLC, bringing over two decades of practical expertise in multi-division project leadership and advisory.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="pt-8 border-t border-slate-200 space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPosts.map((r) => (
                    <Link
                      key={r.id}
                      href={`/blog/${r.slug}`}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#C8973E] transition-colors shadow-sm block group"
                    >
                      <span className="text-[10px] font-bold text-[#C8973E] uppercase tracking-wider block mb-1">
                        {r.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#0A2540] group-hover:text-[#C8973E] transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                        {r.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
