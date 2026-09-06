const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getBlogImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const normalizedPath = imagePath.replace(/^\/+/, '');
  const uploadPath = normalizedPath.startsWith('uploads/')
    ? normalizedPath
    : `uploads/${normalizedPath}`;

  return `${IMAGE_BASE_URL}/${uploadPath}`;
};

export const getBlogGalleryImages = (blog = {}) => {
  const images = Array.isArray(blog?.images) ? blog.images : [];

  return [...images]
    .filter((image) => image && (image.image_path || image.src))
    .sort((a, b) => (Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)))
    .map((image) => ({
      ...image,
      image_path: image.image_path || image.src || '',
    }));
};

export const getBlogCoverImage = (blog) => getBlogGalleryImages(blog)[0]?.image_path || '';

export const formatBlogDate = (date) => {
  if (!date) return '';
  const dateOnly = String(date).split('T')[0];
  const parsedDate = new Date(`${dateOnly}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};