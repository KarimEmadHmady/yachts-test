import type { Yacht, YachtSpecification } from '../types/Yacht.types';

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getYachtImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

export const formatYachtPrice = (yacht: Yacht): string => {
  const currency = yacht.currency || 'USD';

  if (yacht.listing_type === 'charter' && yacht.price_charter) {
    const period = yacht.price_charter_period ? ` / ${yacht.price_charter_period}` : '';
    return `${currency} ${Number(yacht.price_charter).toLocaleString()}${period}`;
  }

  if (yacht.price_sale) {
    return `${currency} ${Number(yacht.price_sale).toLocaleString()}`;
  }

  return 'Price on request';
};

export const groupSpecifications = (
  specifications: YachtSpecification[] = [],
) => {
  const sorted = [...specifications].sort((a, b) => a.sort_order - b.sort_order);

  return {
    specification: sorted.filter((spec) => spec.spec_group === 'specification'),
    characteristic: sorted.filter((spec) => spec.spec_group === 'characteristic'),
  };
};

export const getImagesByType = (yacht: Yacht, type: string): string[] =>
  (yacht.images || [])
    .filter((img) => img.image_type === type)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => img.image_path);

export const getYachtCoverImage = (yacht: Yacht): string => {
  if (yacht.cover_image) return yacht.cover_image;
  const coverImages = getImagesByType(yacht, 'cover');
  if (coverImages.length > 0) return coverImages[0];
  const galleryImages = getImagesByType(yacht, 'gallery');
  return galleryImages[0] || '';
};

/** @deprecated استخدم getYachtCoverImage / getImagesByType بدل كده */
export const getYachtGalleryImages = (yacht: Yacht): string[] => {
  const images = (yacht.images || []).map((img) => img.image_path);
  if (yacht.cover_image) return [yacht.cover_image, ...images];
  return images;
};