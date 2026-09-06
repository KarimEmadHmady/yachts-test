'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';

const defaultBrand = {
  name: '',
  slug: '',
  logo_path: '',
  is_active: true,
};

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function BrandFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  submitting = false,
  mode = 'create',
}) {
  const [form, setForm] = useState(defaultBrand);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || defaultBrand);
      setSelectedFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedFile) {
      const payload = new FormData();
      payload.append('name', form.name || '');
      payload.append('slug', form.slug || '');
      payload.append('is_active', Boolean(form.is_active) ? '1' : '0');
      payload.append('logo', selectedFile);

      if (form.logo_path) {
        payload.append('logo_path', form.logo_path);
      }

      onSubmit(payload);
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0E2D4A]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Brand</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Brand' : 'Add Brand'}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Brand Name
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(event) => {
                const nextName = event.target.value;
                setForm((prev) => ({
                  ...prev,
                  name: nextName,
                  slug: prev.slug || slugify(nextName),
                }));
              }}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              placeholder="e.g. Bali"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Slug
            </label>
            <input
              type="text"
              value={form.slug || ''}
              onChange={(event) => handleChange('slug', slugify(event.target.value))}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              placeholder="bali"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Logo URL
            </label>
            <input
              type="text"
              value={form.logo_path || ''}
              onChange={(event) => handleChange('logo_path', event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#012241]"
            />
            {(selectedFile || form.logo_path) && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : (form.logo_path?.startsWith('http') ? form.logo_path : `${API_BASE}/uploads/${(form.logo_path || '').replace(/^\/+/, '')}`)}
                  alt="Brand preview"
                  className="h-14 w-14 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-white/10 dark:bg-[#012241]">
            <input
              type="checkbox"
              checked={Boolean(form.is_active)}
              onChange={(event) => handleChange('is_active', event.target.checked)}
              className="h-4 w-4 accent-[#C9A868]"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">Active</span>
          </label>

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
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
