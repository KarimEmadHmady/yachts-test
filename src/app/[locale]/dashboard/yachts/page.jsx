'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDashboardYachts } from '@/features/dashboard/yachts/hooks/useDashboardYachts';
import { YachtTable } from '@/features/dashboard/yachts/components/YachtTable';

const getImageUrl = (value) => {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  const clean = value.replace(/^\/+/, '');
  const normalized = clean.startsWith('uploads/') ? clean : `uploads/${clean}`;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts'}/${normalized}`;
};

export default function DashboardYachtsPage() {
  const {
    yachts,
    selectedYacht,
    setSelectedYacht,
    fetchYachts,
    fetchYachtBySlug,
    deleteYacht,
    updateStatus,
    uploadImages,
    updateSpecifications,
    updateAmenities,
    loading,
    error,
  } = useDashboardYachts();

  const [searchTerm, setSearchTerm] = useState('');
  const [detailsYacht, setDetailsYacht] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchYachts().catch(() => undefined);
  }, [fetchYachts]);

  const visibleYachts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return yachts;

    return yachts.filter((yacht) => {
      const haystack = `${yacht.name || ''} ${yacht.brand_name || ''} ${yacht.submitted_brand_name || ''}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [yachts, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this yacht?')) return;
    try {
      await deleteYacht(id);
    } catch (requestError) {
      console.error(requestError);
    }
  };

  const handleOpenDetails = async (yacht) => {
    if (!yacht?.slug) {
      setDetailsYacht(yacht || null);
      return;
    }

    try {
      setDetailsLoading(true);
      const result = await fetchYachtBySlug(yacht.slug);
      setDetailsYacht(result || yacht);
    } catch (requestError) {
      console.error(requestError);
      setDetailsYacht(yacht || null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const gallerySections = [
    { key: 'cover', label: 'Cover' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'interior', label: 'Interior' },
    { key: 'layout', label: 'Layout' },
  ];

  const groupedImages = gallerySections.reduce((accumulator, section) => {
    accumulator[section.key] = Array.isArray(detailsYacht?.images)
      ? detailsYacht.images.filter((image) => (image.image_type || 'gallery') === section.key)
      : [];
    return accumulator;
  }, { cover: [], gallery: [], interior: [], layout: [] });

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Yachts</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/edit-yacht/new" className="rounded-xl bg-[#C9A868] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
              + Add Yacht
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#0E2D4A]">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search yachts by name or brand..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]"
          />
        </div>

        <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#0E2D4A]">
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A]">
                Loading yachts...
              </div>
            ) : (
              <YachtTable
                yachts={visibleYachts}
                selectedId={selectedYacht?.id}
                onSelect={(yacht) => {
                  setSelectedYacht(yacht);
                  handleOpenDetails(yacht);
                }}
                onDelete={handleDelete}
                onStatusChange={(id, status) => updateStatus(id, status).catch(console.error)}
              />
            )}
          </div>
        </div>
      </div>

      {detailsYacht && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[95vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#0E2D4A]">
            <div className="flex items-center justify-between border-b border-black/10 p-5 dark:border-white/10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Yacht details</p>
                <h2 className="mt-2 text-2xl font-bold">{detailsYacht.name || 'Untitled Yacht'}</h2>
              </div>
              <button type="button" onClick={() => setDetailsYacht(null)} className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 dark:border-white/10 dark:text-gray-200">
                Close
              </button>
            </div>

            <div className="max-h-[calc(95vh-110px)] overflow-y-auto p-5">
              {detailsLoading ? (
                <div className="py-10 text-center text-sm text-gray-500">Loading yacht details...</div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Status</p>
                      <p className="mt-2 font-semibold">{detailsYacht.status || 'draft'}</p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Condition</p>
                      <p className="mt-2 font-semibold">{detailsYacht.condition_type || '-'}</p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Listing</p>
                      <p className="mt-2 font-semibold">{detailsYacht.listing_type || '-'}</p>
                    </div>
                    <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Price</p>
                      <p className="mt-2 font-semibold">{detailsYacht.price_sale ? `$${Number(detailsYacht.price_sale).toLocaleString()}` : '-'}</p>
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                        <h3 className="mb-3 text-lg font-semibold">Gallery</h3>
                        <div className="space-y-5">
                          {gallerySections.map((section) => {
                            const images = groupedImages[section.key] || [];

                            if (!images.length) {
                              return null;
                            }

                            return (
                              <div key={section.key} className="rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-[#0E2D4A]">
                                <div className="mb-3 flex items-center justify-between">
                                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A868]">{section.label}</h4>
                                  <span className="text-xs text-gray-500">{images.length}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                  {images.map((image, index) => (
                                    <img
                                      key={image.id || `${image.image_path}-${index}`}
                                      src={getImageUrl(image.image_path || image.src)}
                                      alt={`${detailsYacht.name || 'Yacht'} ${section.label} ${index + 1}`}
                                      className="h-28 w-full rounded-xl object-cover"
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}

                          {!gallerySections.some((section) => (groupedImages[section.key] || []).length) && (
                            <p className="text-sm text-gray-500">No images available</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                        <h3 className="mb-3 text-lg font-semibold">Specifications</h3>
                        {Array.isArray(detailsYacht.specifications) && detailsYacht.specifications.length > 0 ? (
                          <div className="space-y-2">
                            {detailsYacht.specifications.map((spec, index) => (
                              <div key={spec.id || `${spec.label}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 dark:bg-[#0E2D4A]">
                                <span className="font-medium">{spec.label}</span>
                                <span className="text-gray-600 dark:text-gray-300">{spec.value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No specifications</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                        <h3 className="mb-3 text-lg font-semibold">Overview</h3>
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Slug</dt><dd className="font-medium">{detailsYacht.slug || '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Brand ID</dt><dd className="font-medium">{detailsYacht.brand_id ?? '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Category ID</dt><dd className="font-medium">{detailsYacht.category_id ?? '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Type</dt><dd className="font-medium">{detailsYacht.type || '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Size</dt><dd className="font-medium">{detailsYacht.size_meters ? `${detailsYacht.size_meters} m` : '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Cabins</dt><dd className="font-medium">{detailsYacht.cabins ?? '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Year</dt><dd className="font-medium">{detailsYacht.year_built ?? '-'}</dd></div>
                          <div className="flex justify-between gap-3"><dt className="text-gray-500">Submission</dt><dd className="font-medium">{detailsYacht.submission_status || '-'}</dd></div>
                        </dl>
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                        <h3 className="mb-3 text-lg font-semibold">Amenities</h3>
                        {Array.isArray(detailsYacht.amenities) && detailsYacht.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {detailsYacht.amenities.map((amenity) => (
                              <span key={amenity.id} className="rounded-full bg-[#C9A868]/10 px-3 py-1 text-xs font-medium text-[#C9A868]">
                                {amenity.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No amenities</p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-[#012241]">
                        <h3 className="mb-3 text-lg font-semibold">Description</h3>
                        <p className="text-sm leading-6 text-gray-700 dark:text-gray-200">{detailsYacht.description || 'No description'}</p>
                        {detailsYacht.video_url && (
                          <a href={detailsYacht.video_url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium text-[#C9A868]">
                            Watch video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
