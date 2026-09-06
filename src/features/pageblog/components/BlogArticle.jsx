import { CalendarDays } from 'lucide-react';
import { formatBlogDate } from '../utils/blog.utils';

export function BlogArticle({ blog }) {
  return (
    <section className="  max-w-4xl space-y-6 text-black/75 dark:text-white/75">
      <div className="flex items-center gap-2 text-sm text-[#C9A868]">
        <CalendarDays className="h-4 w-4" />
        {formatBlogDate(blog.date)}
      </div>
      <p className="text-base font-medium leading-relaxed text-black/80 dark:text-white/80">
        {blog.description}
      </p>
      <div className="whitespace-pre-line text-sm leading-8 text-black/65 dark:text-white/70">
        {blog.content}
      </div>
    </section>
  );
}