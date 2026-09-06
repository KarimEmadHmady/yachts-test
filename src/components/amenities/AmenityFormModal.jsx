'use client';

import { useEffect, useState } from 'react';

const defaultAmenity = {
  name: '',
  icon: '',
};

export default function AmenityFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  submitting = false,
  mode = 'create',
}) {
  const [form, setForm] = useState(defaultAmenity);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || defaultAmenity);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0E2D4A]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Amenity</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit Amenity' : 'Add Amenity'}
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
              Amenity Name
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(event) => handleChange('name', event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              placeholder="e.g. Wi-Fi"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Icon
            </label>
            <input
              type="text"
              value={form.icon || ''}
              onChange={(event) => handleChange('icon', event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#C9A868] focus:bg-white dark:border-white/10 dark:bg-[#012241] dark:text-white"
              placeholder="e.g. wifi, pool, sun"
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
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Amenity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
