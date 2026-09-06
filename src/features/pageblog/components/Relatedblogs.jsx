'use client';

import { useRouter } from 'next/navigation';
import { useBlogs } from '../hooks/useBlogs';
import { getBlogImageUrl } from '../utils/blog.utils';

const getThumbnail = (item) => {
  const path = item.images?.[0]?.image_path || item.image_path || item.image;
  return path ? getBlogImageUrl(path) : null;
};

export function RelatedBlogs({ blog }) {
  const router = useRouter();
  const { blogs, isLoading } = useBlogs();

  const relatedBlogs = (blogs || [])
    .filter((item) => String(item.id) !== String(blog.id))
    .slice(0, 3);

  if (isLoading) {
    return (
      <aside className="w-full rounded-3xl bg-[#0B1830] p-4 dark:bg-[#0B1830] sm:p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#C9A868]">
          Related Blogs
        </h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 w-full animate-pulse rounded-3xl bg-white/5 sm:h-52"
            />
          ))}
        </div>
      </aside>
    );
  }

  if (!relatedBlogs.length) return null;

  return (
    <aside className="w-full rounded-3xl bg-[#f7f7f7] p-4 shadow-lg dark:bg-white/[0.03] sm:p-5">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#C9A868]">
        Related Blogs
      </h2>

      <div className="flex flex-col gap-4">
        {relatedBlogs.map((item) => {
          const thumbnail = getThumbnail(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(`/blogs/${item.id}`)}
              className="group relative block h-44 w-full overflow-hidden rounded-3xl bg-black/20 text-left ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.01] sm:h-52"
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900" />
              )}

              {/* Dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Title */}
              <span className="absolute inset-x-0 bottom-0 p-4 text-base font-bold uppercase leading-snug tracking-wide text-white drop-shadow-md sm:text-lg">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}