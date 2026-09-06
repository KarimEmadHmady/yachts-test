'use client';

import { useRef, useState } from 'react';

const getImageUrl = (value) => {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts'}/uploads/${value.replace(/^\/+/, '')}`;
};

export function YachtImageGallery({ yacht, onUploadImages }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imageType, setImageType] = useState('gallery');

  const images = Array.isArray(yacht?.images)
    ? yacht.images.filter((image) => (image.image_type || 'gallery') === imageType)
    : [];

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !yacht?.id || !onUploadImages) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('image_type', imageType);

    try {
      setUploading(true);
      await onUploadImages(yacht.id, formData);
      event.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{imageType.charAt(0).toUpperCase() + imageType.slice(1)}</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            <span className="mr-1">Type</span>
            <select
              value={imageType}
              onChange={(event) => setImageType(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none dark:border-white/10 dark:bg-[#0E2D4A]"
            >
              <option value="gallery">Gallery</option>
              <option value="cover">Cover</option>
              <option value="interior">Interior</option>
              <option value="layout">Layout</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl bg-[#C9A868] px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Upload images'}
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-300">
          No images uploaded for {imageType} yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((image, index) => (
            <div key={image.id || `${image.image_path}-${index}`} className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0E2D4A]">
              <img src={getImageUrl(image.image_path || image.src)} alt={`${yacht?.name || 'Yacht'} ${imageType} ${index + 1}`} className="h-32 w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
