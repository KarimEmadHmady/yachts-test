'use client';

import { useEffect, useState } from 'react';
import AmenityFormModal from '@/components/amenities/AmenityFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAmenities } from '@/hooks/useAmenities';

export default function AmenitiesPage() {
  const { amenities, loading, error, fetchAmenities, createAmenity, updateAmenity, deleteAmenity } = useAmenities();
  const [showForm, setShowForm] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchAmenities().catch(() => undefined);
  }, [fetchAmenities]);

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('auth_token');

    try {
      setSubmitLoading(true);
      if (editingAmenity) {
        await updateAmenity(editingAmenity.id, payload, token);
      } else {
        await createAmenity(payload, token);
      }
      setShowForm(false);
      setEditingAmenity(null);
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
      await deleteAmenity(deleteTarget.id, token);
      setDeleteTarget(null);
    } catch (requestError) {
      alert(requestError.message || 'Failed to delete amenity');
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Amenities</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingAmenity(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-[#C9A868] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            + Add Amenity
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#0E2D4A]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Icon</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    Loading amenities...
                  </td>
                </tr>
              ) : amenities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No amenities found.
                  </td>
                </tr>
              ) : (
                amenities.map((amenity) => (
                  <tr key={amenity.id} className="border-b border-black/5 dark:border-white/5">
                    <td className="p-4">{amenity.id}</td>
                    <td className="p-4 font-medium">{amenity.name}</td>
                    <td className="p-4">
                      {amenity.icon ? (
                        <span className="inline-flex rounded-full border border-[#C9A868]/40 bg-[#C9A868]/10 px-2.5 py-1 text-xs font-medium text-[#C9A868]">
                          {amenity.icon}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAmenity(amenity);
                            setShowForm(true);
                          }}
                          className="rounded-lg border border-[#C9A868] px-3 py-1.5 text-xs font-medium text-[#C9A868] hover:bg-[#C9A868]/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(amenity)}
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

      <AmenityFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAmenity(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingAmenity}
        submitting={submitLoading}
        mode={editingAmenity ? 'edit' : 'create'}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${deleteTarget?.name || 'this amenity'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}
