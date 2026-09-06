'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts';

const defaultCategory = {
  brand_ids: [],
  name: '',
  slug: '',
  image_path: '',
};

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  brands = [],
  submitting = false,
  mode = 'create',
}) {
  const [form, setForm] = useState(defaultCategory);
  const [selectedFile, setSelectedFile] = useState(null);

useEffect(() => {
  if (isOpen) {
    const normalized = initialData
      ? {
          ...defaultCategory,
          ...initialData,
          brand_ids: (initialData.brand_ids || (initialData.brand_id ? [initialData.brand_id] : [])).map(String),
        }
      : { ...defaultCategory, brand_ids: brands[0] ? [String(brands[0].id)] : [] };

    setForm(normalized);
    setSelectedFile(null);
  }
}, [initialData, isOpen, brands]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.brand_ids || form.brand_ids.length === 0) {
      return alert('Please select at least one brand');
    }

    const { id, created_at, updated_at, ...rest } = form;

    if (selectedFile) {
      const payload = new FormData();
      payload.append('name', form.name || '');
      payload.append('slug', form.slug || '');
      payload.append('image', selectedFile);
      form.brand_ids.forEach((brandId) => payload.append('brand_ids', String(brandId)));
      if (form.image_path) payload.append('image_path', form.image_path);
      onSubmit(payload);
      return;
    }

    onSubmit({
      ...rest,
      brand_ids: form.brand_ids.map((idValue) => Number(idValue)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0E2D4A]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Category</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Category' : 'Add Category'}
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
              Brands
            </label>
            <div className="grid gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-[#012241]">
              {brands.length === 0 ? (
                <p className="text-sm text-gray-500">No brands available.</p>
              ) : (
                brands.map((brand) => {
                  const checked = (form.brand_ids || []).includes(String(brand.id)) || (form.brand_ids || []).includes(Number(brand.id));

                  return (
                    <label key={brand.id} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                      <input
                        type="checkbox"
                        checked={checked}
onChange={(event) => {
  const value = String(brand.id);
  const next = new Set((form.brand_ids || []).map(String));

  if (event.target.checked) {
    next.add(value);
  } else {
    next.delete(value);
  }

  handleChange('brand_ids', Array.from(next));
}}
                        className="h-4 w-4 accent-[#C9A868]"
                      />
                      <span>{brand.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Category Name
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
              placeholder="e.g. Sailing Catamaran"
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
              placeholder="sailing-catamaran"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-[#012241]"
            />
            {(selectedFile || form.image_path) && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : (form.image_path?.startsWith('http') ? form.image_path : `${API_BASE}/uploads/${(form.image_path || '').replace(/^\/+/, '')}`)}
                  alt="Category preview"
                  className="h-14 w-14 rounded-lg object-cover"
                />
              </div>
            )}
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
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
