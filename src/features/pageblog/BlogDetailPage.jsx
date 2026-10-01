'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BlogArticle } from './components/BlogArticle';
import { BlogGallery } from './components/BlogGallery';
import { RelatedBlogs } from './components/Relatedblogs';
import { useBlog } from './hooks/useBlog';

export default function BlogDetailPage({ id }) {
  const router = useRouter();
  const { blog, isLoading, error } = useBlog(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#fffff] px-6 py-10 dark:bg-[#0E2D4A] md:px-12">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-black/10 dark:bg-white/10" />
          <div className="aspect-[16/7] w-full rounded-2xl bg-black/10 dark:bg-white/10" />
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffff] px-6 text-black dark:bg-[#0E2D4A] dark:text-white">
        <p className="text-sm text-black/60 dark:text-white/60">{error || 'Blog not found.'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffff] px-6 py-8 text-black dark:bg-[#0E2D4A] dark:text-white md:px-12 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div data-reveal="up" data-reveal-delay="50" className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back to blogs"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/70 transition-colors hover:border-[#C9A868] hover:text-[#C9A868] dark:border-white/10 dark:text-white/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A868]">Blog</span>
          </div>

          <span className="shrink-0 rounded-full border border-[#C9A868]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A868]">
            Blog Details
          </span>
        </div>

        <h1 data-reveal="up" data-reveal-delay="120" className="max-w-4xl text-2xl font-bold uppercase tracking-wide md:text-4xl">{blog.title}</h1>

        {/* Gallery: full width, 4 images exactly as before */}
        <div className="mt-7">
          <BlogGallery blog={blog} />
        </div>

        {/* Below the gallery: article details next to Related Blogs */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
          <BlogArticle blog={blog} />
          <RelatedBlogs blog={blog} />
        </div>
      </div>
    </main>
  );
}