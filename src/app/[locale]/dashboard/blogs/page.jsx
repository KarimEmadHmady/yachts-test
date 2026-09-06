'use client';

import { useEffect, useState } from 'react';
import BlogFormModal from '@/components/blogs/BlogFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAdminBlogs } from '@/features/pageblog/hooks/useAdminBlogs';

// دالة تنسيق التاريخ - بتتعامل مع أي فورمات جاي من الباك اند (ISO, timestamp, string عادي)
function formatDate(rawDate) {
  if (!rawDate) return '—';

  const date = new Date(rawDate);
  if (isNaN(date.getTime())) return String(rawDate);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getImageUrl(image) {
  if (!image) return '';
  const raw = typeof image === 'string' ? image : image.image_path;
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;

  const clean = raw.replace(/^\/+/, '');
  const normalized = clean.startsWith('uploads/') ? clean : `uploads/${clean}`;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://revamp.alpha-odin.com/yachts';

  return `${baseUrl.replace(/\/$/, '')}/${normalized}`;
}

export default function BlogsDashboardPage() {
  const { blogs, isLoading, error, fetchBlogs, createBlog, updateBlog, deleteBlog } = useAdminBlogs();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchBlogs().catch(() => undefined);
  }, [fetchBlogs]);

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem('auth_token');

    try {
      setSubmitLoading(true);
      const { images, ...rest } = payload;

      if (editingBlog) {
        await updateBlog(editingBlog.id, rest, images, token);
      } else {
        if (!images || images.length !== 4) {
          throw new Error('Exactly 4 images are required');
        }
        await createBlog(rest, images, token);
      }

      setShowForm(false);
      setEditingBlog(null);
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
      await deleteBlog(deleteTarget.id, token);
      setDeleteTarget(null);
    } catch (requestError) {
      alert(requestError.message || 'Failed to delete blog');
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C9A868]">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Blogs</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingBlog(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-[#C9A868] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            + Add Blog
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-xl border border-black/10 bg-white p-12 text-center text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A]">
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white p-12 text-center text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A]">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog) => {
              const cover = Array.isArray(blog.images) && blog.images.length > 0 ? blog.images[0] : null;
              const coverUrl = getImageUrl(cover);

              return (
                <div
                  key={blog.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#0E2D4A]"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-[#012241]">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}

                    <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                      {Array.isArray(blog.images) ? blog.images.length : 0} images
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#C9A868]">
                      {formatDate(blog.date)}
                    </p>

                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                      {blog.title}
                    </h3>

                    {blog.description && (
                      <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-300">
                        {blog.description}
                      </p>
                    )}

                    <div className="mt-auto flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlog(blog);
                          setShowForm(true);
                        }}
                        className="rounded-lg border border-[#C9A868] px-3 py-1.5 text-xs font-medium text-[#C9A868] hover:bg-[#C9A868]/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(blog)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BlogFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBlog(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingBlog}
        submitting={submitLoading}
        mode={editingBlog ? 'edit' : 'create'}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Blog"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this blog'}"?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </section>
  );
}