'use client';

import { useEffect, useMemo, useState } from 'react';
import { leadService } from '@/services/leadService';

type Tab = 'enquiry' | 'contact' | 'service';

const TAB_LABELS: Record<Tab, string> = {
  enquiry: 'Enquiries',
  contact: 'Contact',
  service: 'Service',
};

// تنسيق التاريخ + الوقت بشكل نضيف بدل الـ ISO الخام
function formatDateTime(rawDate?: string) {
  if (!rawDate) return '-';

  const date = new Date(rawDate);
  if (isNaN(date.getTime())) return rawDate;

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} · ${timePart}`;
}

export default function LeadsPage() {
  const [tab, setTab] = useState<Tab>('enquiry');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<{ name: string; message: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }
    leadService.getEnquiries(token)
      .then((enquiryRows) => {
        setEnquiries(enquiryRows);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    enquiry: enquiries.filter((row) => row.type === 'enquiry').length,
    contact: enquiries.filter((row) => row.type === 'contact').length,
    service: enquiries.filter((row) => row.type === 'service').length,
  }), [enquiries]);

  const rows = enquiries.filter((row) => row.type === tab);

  const tabButtonClass = (active: boolean) =>
    `rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
      active
        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-[#0E2D4A]'
        : 'border-black/15 text-black/60 hover:bg-black/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/10'
    }`;

  const getInitials = (name?: string) =>
    (name || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?';

  return (
    <section className="min-h-screen bg-[#f7f7f7] text-black transition-colors dark:bg-[#0E2D4A] dark:text-white p-6 lg:ml-64 md:ml-64 ml-0 mt-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold">Leads</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {(Object.keys(TAB_LABELS) as Tab[]).map((key) => (
              <button key={key} type="button" onClick={() => setTab(key)} className={tabButtonClass(tab === key)}>
                {TAB_LABELS[key]} ({counts[key]})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center text-sm text-black/50 dark:border-white/10 dark:bg-[#12395c] dark:text-white/50">
            Loading...
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-10 text-center text-sm text-black/50 dark:border-white/10 dark:bg-[#12395c] dark:text-white/50">
            No {TAB_LABELS[tab].toLowerCase()} yet
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-2xl border border-black/10 bg-white p-4 transition-colors hover:border-black/20 dark:border-white/10 dark:bg-[#12395c] dark:hover:border-white/20 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-black/60 dark:bg-white/10 dark:text-white/70">
                      {getInitials(row.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold">{row.name || 'Unnamed'}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/60 dark:text-white/60">
                        {row.email && <span className="truncate">{row.email}</span>}
                        {row.phone && (
                          <>
                            <span className="text-black/20 dark:text-white/20">•</span>
                            <span>{row.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs text-black/40 dark:text-white/40 sm:pt-1">
                    {formatDateTime(row.created_at)}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-black/35 dark:text-white/35">
                      Yacht / Page
                    </p>
                    <p className="mt-0.5 truncate text-sm text-black/70 dark:text-white/70">
                      {row.yacht_name ? `${row.yacht_name} (${row.yacht_slug})` : row.page_url || '-'}
                    </p>
                  </div>

                  {row.message && (
                    <button
                      type="button"
                      onClick={() => setActiveMessage({ name: row.name, message: row.message })}
                      className="shrink-0 self-start rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-black/60 hover:bg-black/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/10 transition-colors sm:self-auto"
                    >
                      View message
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message viewer modal */}
      {activeMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setActiveMessage(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white dark:bg-[#12395c] shadow-2xl transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">Message from</p>
                <h3 className="text-base font-semibold">{activeMessage.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="rounded-full p-1.5 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-black/80 dark:text-white/80">
                {activeMessage.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}