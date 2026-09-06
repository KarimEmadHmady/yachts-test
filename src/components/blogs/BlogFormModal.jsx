'use client';

import { useEffect, useState } from 'react';

const defaultBlog = {
  title: '',
  date: '',
  description: '',
  content: '',
};

export default function BlogFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  submitting = false,
  mode = 'create',
}) {
  const [form, setForm] = useState(defaultBlog);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || defaultBlog);
      setExistingImages(Array.isArray(initialData?.images) ? initialData.images : []);
      setImages([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, images });
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    const raw = typeof image === 'string' ? image : image.image_path;
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;

    const clean = raw.replace(/^\/+/, '');
    const normalized = clean.startsWith('uploads/') ? clean : `uploads/${clean}`;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';

    return `${baseUrl.replace(/\/$/, '')}/${normalized}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0E2D4A]">
        <div className="p-6 pb-4">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Blog</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {mode === 'edit' ? 'Edit Blog' : 'Add Blog'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[calc(95vh-120px)] overflow-y-auto p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(event) => handleChange('title', event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
              <input
                type="date"
                value={form.date || ''}
                onChange={(event) => handleChange('date', event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Short Description</label>
              <textarea
                value={form.description || ''}
                onChange={(event) => handleChange('description', event.target.value)}
                required
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
              <textarea
                value={form.content || ''}
                onChange={(event) => handleChange('content', event.target.value)}
                required
                rows={6}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              />
            </div>

            {existingImages.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Current Images</label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id || `${image.image_path}-${index}`} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-[#012241]">
                      <img
                        src={getImageUrl(image)}
                        alt={`${form.title || 'Blog'} ${index + 1}`}
                        className="h-24 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {mode === 'edit' ? 'Add new images (optional, leave empty to keep current ones)' : 'Images (4 required)'}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setImages(Array.from(event.target.files || []))}
                className="w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 dark:border-white/10 dark:bg-[#012241] dark:text-gray-200"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#C9A868] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
