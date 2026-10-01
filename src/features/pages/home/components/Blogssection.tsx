'use client';

import Image from "next/image";
import Link from "next/link";
import { useBlogs } from "@/features/pageblog/hooks/useBlogs";
import { getBlogCoverImage, getBlogImageUrl } from "@/features/pageblog/utils/blog.utils";

interface Blog {
  id: number;
  title: string;
  description?: string;
  images?: Array<{ image_path: string }>;
  date?: string;
}

export default function BlogsSection() {
  const { blogs = [], isLoading } = useBlogs() as { blogs: Blog[]; isLoading: boolean };

  // Get last 3 blogs
  const lastThreeBlogs = blogs.slice(-3).reverse();

  if (isLoading) {
    return (
      <section className="relative bg-white dark:bg-[#012241] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#C9A868] mb-3">
            Blogs
          </p>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-md leading-relaxed mb-8 transition-colors duration-300">
            Articles And News About Yachting
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-70 rounded-2xl bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white dark:bg-[#012241] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}
        <p
          data-reveal="up"
          data-reveal-delay="50"
          className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#C9A868] mb-3"
        >
          Blogs
        </p>

        <p
          data-reveal="up"
          data-reveal-delay="150"
          className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-md leading-relaxed mb-8 transition-colors duration-300"
        >
          Articles And News About Yachting
        </p>

        {/* Cards grid */}
        <div data-reveal-stagger="150" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {lastThreeBlogs.map((blog) => {
            const coverImage = getBlogCoverImage(blog);
            const imageUrl = coverImage ? getBlogImageUrl(coverImage) : '';

            return (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                data-reveal="up"
                data-reveal-duration="850"
                className="group relative h-70 rounded-2xl overflow-hidden block"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={blog.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/40">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                <h3 className="absolute bottom-5 left-5 right-5 font-serif font-bold text-lg text-white leading-snug">
                  {blog.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
