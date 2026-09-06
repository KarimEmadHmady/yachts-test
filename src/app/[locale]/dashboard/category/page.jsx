'use client';

import { useEffect, useState } from 'react';
import CategoryFormModal from '@/components/categories/CategoryFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useCategories } from '@/hooks/useCategories';
import { brandService } from '@/services/brandService';

export default function CategoryPage() {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const result = await brandService.list();
        setBrands(Array.isArray(result) ? result : []);
      } catch (brandError) {
        setBrands([]);
      }
    };

    loadBrands();
    fetchCategories().catch(() => undefined);
  }, [fetchCategories]);

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('auth_token');

    try {
      setSubmitLoading(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload, token);
      } else {
        await createCategory(payload, token);
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (requestError) {
      alert(requestError.message || 'Something went wrong');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    const token = localStorage.getItem('auth_token');

    try {
      await deleteCategory(deleteTarget.id, token);
      setDeleteTarget(null);
    } catch (requestError) {
      alert(requestError.message || 'Failed to delete category');
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Categories</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-[#C9A868] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            + Add Category
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0E2D4A]">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">ID</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => {
                  const selectedBrands = (category.brand_ids || []).length
                    ? (category.brand_ids || [])
                    : (category.brand_id ? [category.brand_id] : []);

                  const brandNames = selectedBrands
                    .map((brandId) => brands.find((brand) => String(brand.id) === String(brandId))?.name)
                    .filter(Boolean)
                    .join(', ');

                  const imageUrl = category.image_path
                    ? (category.image_path.startsWith('http') ? category.image_path : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts'}/uploads/${category.image_path.replace(/^\/+/, '')}`)
                    : '';

                  return (
                    <tr key={category.id} className="border-b border-black/5 dark:border-white/5">
                      <td className="p-4">
                        {imageUrl ? (
                          <img src={imageUrl} alt={category.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A868]/15 text-xs font-bold text-[#C9A868]">
                            {category.name?.slice(0, 2).toUpperCase() || 'CT'}
                          </div>
                        )}
                      </td>
                      <td className="p-4">{category.id}</td>
                      <td className="p-4">{brandNames || '-'}</td>
                      <td className="p-4 font-medium">{category.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{category.slug}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(category);
                              setShowForm(true);
                            }}
                            className="rounded-lg border border-[#C9A868] px-3 py-1.5 text-xs font-medium text-[#C9A868] hover:bg-[#C9A868]/10"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(category)}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        brands={brands}
        submitting={submitLoading}
        mode={editingCategory ? 'edit' : 'create'}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name || 'this category'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
