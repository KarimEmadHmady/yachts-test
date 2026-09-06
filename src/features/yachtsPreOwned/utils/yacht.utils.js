export const getAuthToken = () => (
  typeof window === 'undefined' ? null : localStorage.getItem('auth_token')
);

export const normalizeYachtFilters = (filters = {}) => {
  return { ...filters };
};

export const buildYachtSubmissionFormData = (data, images = []) => {
  const formData = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  images.filter(Boolean).forEach((image) => formData.append('images', image));
  return formData;
};

export const buildYachtImagesFormData = (images = [], imageType = 'gallery') => {
  const formData = new FormData();
  images.filter(Boolean).forEach((image) => formData.append('images', image));
  formData.append('image_type', imageType);
  return formData;
};

export const buildYachtCreateFormData = (data, coverImage) => {
  const formData = new FormData();
  Object.entries(data || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  if (coverImage) formData.append('cover_image', coverImage);
  return formData;
};

export const getYachtImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://revamp.alpha-odin.com/yachts';
  return `${apiUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
};
