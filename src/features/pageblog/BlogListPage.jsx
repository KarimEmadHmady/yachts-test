'use client';

import { useRouter } from 'next/navigation';
import { BlogCard } from './components/BlogCard';
import { useBlogs } from './hooks/useBlogs';

export default function BlogListPage() {
  const router = useRouter();
  const { blogs, isLoading, error } = useBlogs();

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-10 text-black dark:bg-[#012241] dark:text-white md:px-12 md:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p data-reveal="up" data-reveal-delay="50" className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#C9A868]">Blogs</p>
          <h1 data-reveal="up" data-reveal-delay="140" className="text-2xl font-bold uppercase tracking-wide md:text-4xl">Articles &amp; News</h1>
          <p data-reveal="up" data-reveal-delay="220" className="mt-3 max-w-xl text-sm leading-relaxed text-black/55 dark:text-white/60">
            Stories, ideas, and inspiration from the world of yachting.
          </p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[4/3] animate-pulse rounded-2xl bg-black/10 dark:bg-white/10" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {!isLoading && !error && !blogs.length && (
          <p className="rounded-xl border border-black/10 bg-black/[0.02] p-8 text-center text-sm text-black/50 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50">
            No blogs available yet.
          </p>
        )}

        {!isLoading && !error && blogs.length > 0 && (
          <div data-reveal-stagger="160" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onClick={() => router.push(`/blogs/${blog.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}