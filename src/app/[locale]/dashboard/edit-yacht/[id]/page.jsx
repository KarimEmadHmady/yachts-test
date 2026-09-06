'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDashboardYachts } from '@/features/dashboard/yachts/hooks/useDashboardYachts';
import { YachtImageGallery } from '@/features/dashboard/yachts/components/YachtImageGallery';
import { YachtSpecsList } from '@/features/dashboard/yachts/components/YachtSpecsList';
import { YachtAmenitiesList } from '@/features/dashboard/yachts/components/YachtAmenitiesList';
import { useAmenities } from '@/hooks/useAmenities';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';

const defaultForm = {
  name: '',
  slug: '',
  type: '',
  status: 'draft',
  condition_type: 'new',
  listing_type: 'sale',
  price_sale: '',
  price_charter: '',
  price_charter_period: 'day',
  currency: 'USD',
  size_meters: '',
  cabins: '',
  year_built: '',
  brand_id: '',
  category_id: '',
  description: '',
  video_url: '',
  cover_image: null,
  source: 'admin',
  submission_status: 'approved',
  rejection_comment: '',
  submitted_by_first_name: '',
  submitted_by_last_name: '',
  submitted_brand_name: '',
  submitted_by_phone: '',
  submitted_by_email: '',
  submitted_message: '',
};

export default function EditYachtPage() {
  const router = useRouter();
  const { id } = useParams();
  const isNew = id === 'new';
  const { selectedYacht, fetchYachtById, updateYacht, createYacht, uploadImages, updateSpecifications, updateAmenities, loading, error } = useDashboardYachts();
  const { amenities, fetchAmenities } = useAmenities();
  const { brands, fetchBrands } = useBrands();
  const { categories, fetchCategories } = useCategories();
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchAmenities().catch(() => undefined);
    fetchBrands().catch(() => undefined);
    fetchCategories().catch(() => undefined);

    // Get current user data
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      // Try to get user from localStorage or session
      const userData = typeof window !== 'undefined' ? localStorage.getItem('user_data') : null;
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          // Auto-fill submitted by fields for pre-owned yachts
          setForm((prev) => ({
            ...prev,
            submitted_by_first_name: prev.submitted_by_first_name || user.first_name || '',
            submitted_by_last_name: prev.submitted_by_last_name || user.last_name || '',
            submitted_by_email: prev.submitted_by_email || user.email || '',
            submitted_by_phone: prev.submitted_by_phone || user.phone || '',
          }));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, [fetchAmenities, fetchBrands, fetchCategories]);

  useEffect(() => {
    if (isNew) {
      setForm(defaultForm);
      return;
    }

    if (id) {
      fetchYachtById(id).catch(() => undefined);
    }
  }, [id, isNew, fetchYachtById]);

  useEffect(() => {
    if (!selectedYacht) return;
    setForm({
      name: selectedYacht.name || '',
      slug: selectedYacht.slug || '',
      type: selectedYacht.type || '',
      status: selectedYacht.status || 'draft',
      condition_type: selectedYacht.condition_type || 'new',
      listing_type: selectedYacht.listing_type || 'sale',
      price_sale: selectedYacht.price_sale ?? '',
      price_charter: selectedYacht.price_charter ?? '',
      price_charter_period: selectedYacht.price_charter_period || 'day',
      currency: selectedYacht.currency || 'USD',
      size_meters: selectedYacht.size_meters ?? '',
      cabins: selectedYacht.cabins ?? '',
      year_built: selectedYacht.year_built ?? '',
      brand_id: selectedYacht.brand_id ?? '',
      category_id: selectedYacht.category_id ?? '',
      description: selectedYacht.description ?? '',
      video_url: selectedYacht.video_url || '',
      cover_image: selectedYacht.cover_image || '',
      source: selectedYacht.source || 'admin',
      submission_status: selectedYacht.submission_status || 'approved',
      rejection_comment: selectedYacht.rejection_comment || '',
      submitted_by_first_name: selectedYacht.submitted_by_first_name || '',
      submitted_by_last_name: selectedYacht.submitted_by_last_name || '',
      submitted_brand_name: selectedYacht.submitted_brand_name || '',
      submitted_by_phone: selectedYacht.submitted_by_phone || '',
      submitted_by_email: selectedYacht.submitted_by_email || '',
      submitted_message: selectedYacht.submitted_message || '',
    });
  }, [selectedYacht]);

  const yachtForEdit = useMemo(
    () => (selectedYacht ? { ...selectedYacht, allAmenities: amenities } : null),
    [selectedYacht, amenities],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((current) => ({ ...current, cover_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      let payload = {
        name: form.name,
        slug: form.slug,
        type: form.type || null,
        status: form.status,
        condition_type: form.condition_type,
        listing_type: form.listing_type,
        price_sale: form.price_sale === '' ? null : Number(form.price_sale),
        price_charter: form.price_charter === '' ? null : Number(form.price_charter),
        price_charter_period: form.price_charter_period || null,
        currency: form.currency || null,
        size_meters: form.size_meters === '' ? null : Number(form.size_meters),
        cabins: form.cabins === '' ? null : Number(form.cabins),
        year_built: form.year_built === '' ? null : Number(form.year_built),
        brand_id: form.brand_id === '' ? null : Number(form.brand_id),
        category_id: form.category_id === '' ? null : Number(form.category_id),
        description: form.description || null,
        video_url: form.video_url || null,
        source: form.source,
        submission_status: form.submission_status,
        rejection_comment: form.rejection_comment || null,
      };

      // Only include submitted_by fields if condition_type is pre_owned
      if (form.condition_type === 'pre_owned') {
        payload.submitted_by_first_name = form.submitted_by_first_name || null;
        payload.submitted_by_last_name = form.submitted_by_last_name || null;
        payload.submitted_brand_name = form.submitted_brand_name || null;
        payload.submitted_by_phone = form.submitted_by_phone || null;
        payload.submitted_by_email = form.submitted_by_email || null;
        payload.submitted_message = form.submitted_message || null;
      }

      // First, save the yacht data
      let yachtId = id;
      if (isNew) {
        const result = await createYacht(payload);
        yachtId = result?.id;
      } else if (id) {
        await updateYacht(id, payload);
      }

      // Then, upload the cover image if there's a new one
      if (coverImageFile && yachtId) {
        const formData = new FormData();
        formData.append('images', coverImageFile);  
        formData.append('image_type', 'cover');       
        await uploadImages(yachtId, formData);
      }

      // Show success notification
      setNotification({
        show: true,
        type: 'success',
       message: isNew ? 'Yacht created successfully!' : 'Yacht updated successfully!',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/yachts');
      }, 2000);
    } catch (requestError) {
      console.error(requestError);
      setNotification({
        show: true,
        type: 'error',
        message: requestError.message || 'حدث خطأ أثناء حفظ اليخت',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isNew && !selectedYacht && loading) {
    return <div className="min-h-screen p-6 lg:ml-64 md:ml-64 ml-0 mt-16 text-sm text-gray-500">Loading yacht...</div>;
  }

  return (
    <>
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-6 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
            : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}
      <section className="bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">{isNew ? 'Add Yacht' : 'Edit Yacht'}</h1>
          </div>
          <button type="button" onClick={() => router.push('/dashboard/yachts')} className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10">
            Back to yachts
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#0E2D4A]">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Yacht name</span>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Slug</span>
                <input name="slug" value={form.slug} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Type</span>
                <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="">Select type</option>
                  <option value="motor_catamaran">Motor Catamaran</option>
                  <option value="sailing_catamaran">Sailing Catamaran</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Status</span>
                <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Condition</span>
                <select name="condition_type" value={form.condition_type} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="new">New</option>
                  <option value="pre_owned">Pre-owned</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Listing type</span>
                <select name="listing_type" value={form.listing_type} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="sale">Sale</option>
                  <option value="charter">Charter</option>
                  <option value="both">Both</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Price (Sale)</span>
                <input type="number" name="price_sale" value={form.price_sale} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Price (Charter)</span>
                <input type="number" name="price_charter" value={form.price_charter} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Charter Period</span>
                <select name="price_charter_period" value={form.price_charter_period} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Currency</span>
                <input name="currency" value={form.currency} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Size (m)</span>
                <input type="number" step="0.1" name="size_meters" value={form.size_meters} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Cabins</span>
                <input type="number" name="cabins" value={form.cabins} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Year built</span>
                <input type="number" name="year_built" value={form.year_built} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Brand</span>
                <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Category</span>
                <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Video URL</span>
                <input name="video_url" value={form.video_url} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Cover Image</span>
                <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                {form.cover_image && typeof form.cover_image === 'string' && (
                  <div className="mt-2">
                    <img src={form.cover_image} alt="Cover preview" className="max-w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Description</span>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Source</span>
                <select name="source" value={form.source} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-medium">Submission Status</span>
                <select name="submission_status" value={form.submission_status} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]">
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-medium">Rejection Comment</span>
                <textarea name="rejection_comment" value={form.rejection_comment} onChange={handleChange} rows={2} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
              </label>

              {form.condition_type === 'pre_owned' && (
                <>
                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Submitted by First Name</span>
                    <input name="submitted_by_first_name" value={form.submitted_by_first_name} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Submitted by Last Name</span>
                    <input name="submitted_by_last_name" value={form.submitted_by_last_name} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Submitted Brand Name</span>
                    <input name="submitted_brand_name" value={form.submitted_brand_name} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Submitted by Phone</span>
                    <input name="submitted_by_phone" value={form.submitted_by_phone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium">Submitted by Email</span>
                    <input type="email" name="submitted_by_email" value={form.submitted_by_email} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                  </label>

                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="font-medium">Submitted Message</span>
                    <textarea name="submitted_message" value={form.submitted_message} onChange={handleChange} rows={2} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none focus:border-[#C9A868] dark:border-white/10 dark:bg-[#012241]" />
                  </label>
                </>
              )}



            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => router.push('/dashboard/yachts')} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium dark:border-white/10">
                Cancel
              </button>
              <button type="submit" disabled={submitting || loading} className="rounded-xl bg-[#C9A868] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60">
                {submitting ? 'Saving...' : isNew ? 'Create yacht' : 'Save yacht'}
              </button>
            </div>
          </form>

          {yachtForEdit && (
            <div className="space-y-6">
              <YachtImageGallery yacht={yachtForEdit} onUploadImages={uploadImages} />
              <YachtSpecsList yacht={yachtForEdit} onUpdateSpecifications={updateSpecifications} />
              <YachtAmenitiesList yacht={yachtForEdit} onUpdateAmenities={updateAmenities} />
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
