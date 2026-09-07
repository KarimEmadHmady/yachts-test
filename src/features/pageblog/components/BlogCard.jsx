'use client';

import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { formatBlogDate, getBlogCoverImage, getBlogImageUrl } from '../utils/blog.utils';
import { ScrollAnimate } from '@/components/common/ScrollAnimate';

export function BlogCard({ blog, onClick, index = 0 }) {
  const coverImage = getBlogCoverImage(blog);

  return (
    <ScrollAnimate
      as="article"
      direction="up"
      delay={(index % 3) * 120}
      distance={30}
      duration={800}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#C9A868]/70 bg-[#0E2D4A] transition-colors duration-200 hover:border-[#C9A868]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#012241]">
        {coverImage ? (
          <img
            src={getBlogImageUrl(coverImage)}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/40">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#012241]/80 via-transparent to-transparent" />
        <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-[#012241]/70 text-white transition-colors group-hover:border-[#C9A868] group-hover:text-[#C9A868]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <CalendarDays className="h-3.5 w-3.5 text-[#C9A868]" />
          {formatBlogDate(blog.date)}
        </div>
        <h2 className="line-clamp-2 text-base font-semibold uppercase tracking-wide text-white">
          {blog.title}
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">{blog.description}</p>
      </div>
    </ScrollAnimate>
  );
}