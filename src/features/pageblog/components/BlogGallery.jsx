'use client';

import { getBlogGalleryImages, getBlogImageUrl } from '../utils/blog.utils';

export function BlogGallery({ blog }) {
  const images = getBlogGalleryImages(blog);
  if (!images.length) return null;

  const featuredImage = images[0];
  const extraImages = images.slice(1, 4);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 lg:aspect-auto lg:h-[430px]">
        <img
          src={getBlogImageUrl(featuredImage.image_path)}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
      </div>

      {extraImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:h-[430px]">
          {extraImages.map((image, index) => (
            <div
              key={image.id || `${image.image_path}-${index}`}
              className={`relative h-full overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 ${index === 0 ? 'col-span-2' : ''}`}
            >
              <img
                src={getBlogImageUrl(image.image_path)}
                alt={`${blog.title} ${index + 2}`}
                className="h-[100px] w-full object-cover md:h-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}