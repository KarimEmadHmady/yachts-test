'use client';

import { useEffect, useMemo, useState } from 'react';
import BrandFormModal from '@/components/brands/BrandFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useBrands } from '@/hooks/useBrands';

export default function BrandsPage() {
  const { brands, loading, error, fetchBrands, createBrand, updateBrand, deleteBrand } = useBrands();
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchBrands().catch(() => undefined);
  }, [fetchBrands]);

  const totalActive = useMemo(
    () => brands.filter((brand) => brand.is_active !== false).length,
    [brands],
  );

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('auth_token');

    try {
      setSubmitLoading(true);
      if (editingBrand) {
        await updateBrand(editingBrand.id, payload, token);
      } else {
        await createBrand(payload, token);
      }
      setShowForm(false);
      setEditingBrand(null);
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
      await deleteBrand(deleteTarget.id, token);
      setDeleteTarget(null);
    } catch (requestError) {
      alert(requestError.message || 'Failed to delete brand');
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Brands</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#C9A868] px-4 py-2 text-sm font-medium">
              Active: {totalActive}
            </span>
            <button
              type="button"
              onClick={() => {
                setEditingBrand(null);
                setShowForm(true);
              }}
              className="rounded-xl bg-[#C9A868] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            >
              + Add Brand
            </button>
          </div>
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
                <th className="p-4">Logo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Loading brands...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No brands found.
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-black/5 dark:border-white/5">
                    <td className="p-4">
                      {brand.logo_path ? (
                        <img
                          src={brand.logo_path.startsWith('http') ? brand.logo_path : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts'}/uploads/${brand.logo_path.replace(/^\/+/, '')}`}
                          alt={brand.name}
                          className="h-10 w-10 rounded-lg object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A868]/15 text-xs font-bold text-[#C9A868]">
                          {brand.name?.slice(0, 2).toUpperCase() || 'BR'}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{brand.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{brand.slug}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${brand.is_active === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                      >
                        {brand.is_active === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {brand.created_at ? new Date(brand.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBrand(brand);
                            setShowForm(true);
                          }}
                          className="rounded-lg border border-[#C9A868] px-3 py-1.5 text-xs font-medium text-[#C9A868] hover:bg-[#C9A868]/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(brand)}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BrandFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBrand(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingBrand}
        submitting={submitLoading}
        mode={editingBrand ? 'edit' : 'create'}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deleteTarget?.name || 'this brand'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
