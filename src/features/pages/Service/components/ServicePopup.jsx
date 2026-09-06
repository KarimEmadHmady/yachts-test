'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { leadService } from '@/services/leadService';

export default function ServicePopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      await leadService.createEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        type: 'service',
        page_url: window.location.href,
      });
      setForm({ name: '', phone: '', email: '', message: '' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-popup-title"
    >
      {status === 'sent' ? (
        // Thank you popup
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <BadgeCheck className="h-16 w-16 text-[#fffff]" strokeWidth={1.5} fill="#0E2D4A" />
          </div>
          <h2 className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#0E2D4A] sm:text-3xl">
            Thank You
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-black/50">
            Your Request Has Been Submitted, And We Will Get Back To You Very Soon.
          </p>
            
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="mx-auto mt-6 mb-4 mr-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#C9A868] px-6 py-2.5 text-sm text-[#C9A868] transition-colors hover:bg-[#C9A868] hover:text-white"
          >
             service
            <ArrowUpRight className="h-4 w-4" />
          </button>
           <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0E2D4A] px-6 py-2.5 text-sm text-[#0E2D4A] transition-colors hover:bg-[#0E2D4A] hover:text-white"
            >
              Home
              <ArrowUpRight className="h-4 w-4" />
            </Link>
        </div>
      ) : (
        // Service form
        <div className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-black shadow-2xl md:grid-cols-2">
          {/* Form side */}
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <h2
                id="service-popup-title"
                className="text-base font-bold uppercase tracking-wide text-black sm:text-lg"
              >
                Service
              </h2>
           <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#0E2D4A] px-2 py-1 text-sm text-[#0E2D4A] transition-colors hover:bg-[#0E2D4A] hover:text-white"
            >
              Home
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            </div>

            <p className="mt-2 text-sm text-black/50">
              Please Contact Us For More Enquiries
            </p>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
                className="rounded-full border border-black/30 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(event) => update({ phone: event.target.value })}
                className="rounded-full border border-black/30 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <input
                required
                type="email"
                placeholder="E-Mail Address"
                value={form.email}
                onChange={(event) => update({ email: event.target.value })}
                className="rounded-full border border-black/30 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <textarea
                placeholder="Your Message..."
                rows={4}
                value={form.message}
                onChange={(event) => update({ message: event.target.value })}
                className="resize-none rounded-2xl border border-black/30 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-[#C9A868] px-6 py-2.5 text-sm text-[#C9A868] transition-colors hover:bg-[#C9A868] hover:text-white disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Retry' : 'Submit'}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-500">Something went wrong, please try again.</p>
              )}
            </form>
          </div>

          {/* Image side */}
          <div className="relative hidden min-h-120 bg-white md:block">
            <img
              src="/service.png"
              alt="Guests enjoying a yacht voyage"
              className="h-full w-full rounded-3xl object-cover p-3"
            />
          </div>
        </div>
      )}
    </div>
  );
}