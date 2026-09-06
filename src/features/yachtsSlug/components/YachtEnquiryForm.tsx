'use client';

import { useState } from 'react';
import { ArrowRight, BadgeCheck, Phone } from 'lucide-react';
import { leadService } from '@/services/leadService';
import type { Yacht } from '../types/Yacht.types';
import { getYachtImageUrl } from '../utils/yacht.utils';

interface YachtEnquiryFormProps {
  yacht: Yacht;
  isOpen: boolean;
  onClose: () => void;
}

export function YachtEnquiryForm({ yacht, isOpen, onClose }: YachtEnquiryFormProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (!isOpen) return null;

  const image = yacht.cover_image || yacht.images?.[0]?.image_path;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    try {
      await leadService.createEnquiry({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        message: form.message,
        yacht_slug: yacht.slug,
        page_url: window.location.href,
      });
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="yacht-enquiry-title"
      onClick={handleClose}
    >
      {status === 'sent' ? (
        // Thank you popup
        <div
          className="relative w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            <BadgeCheck className="h-16 w-16 text-[#fffff]" strokeWidth={1.5} fill="#0E2D4A" z-10 />
          </div>
          <h2 className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#0E2D4A] sm:text-3xl">
            Thank You
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-black/50">
            Your Inquiry Has Been Submitted, And We Will Get Back To You Very Soon.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-8 rounded-full border border-[#C9A868] px-6 py-2.5 text-sm text-[#C9A868] transition-colors hover:bg-[#C9A868] hover:text-white"
          >
            Close
          </button>
        </div>
      ) : (
        // Enquiry form
        <div
          className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white text-black shadow-2xl md:grid-cols-2"
          onClick={(event) => event.stopPropagation()}
        >
          {/* Form side */}
          <div className="relative p-6 sm:p-8 ">
            <p className="pr-8 text-xs uppercase tracking-widest text-[#C9A868] md:hidden">
              {yacht.name}
            </p>
            <h2 className="sr-only" id="yacht-enquiry-title">
              Send an enquiry about {yacht.name}
            </h2>

            <form onSubmit={submit} className="mt-4 grid gap-4 md:mt-8">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                  className="rounded-full border border-black/50 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
                />
                <input
                  required
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                  className="rounded-full border border-black/50 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
                />
              </div>

              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="rounded-full border border-black/50 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <input
                required
                type="email"
                placeholder="E-Mail Address"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="rounded-full border border-black/50 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <textarea
                placeholder="Your Message..."
                rows={5}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="resize-none rounded-2xl border border-black/50 bg-transparent px-5 py-3.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#C9A868]"
              />

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#C9A868] px-6 py-3 text-sm text-[#C9A868] transition-colors hover:bg-[#C9A868] hover:text-white disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : status === 'error' ? 'Retry' : 'Submit'}
                <ArrowRight className="h-4 w-4" />
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-500">Something went wrong, please try again.</p>
              )}
            </form>
          </div>

          {/* Image side */}
          <div className="relative hidden min-h-[520px] bg-[#ffffff] md:block">
            {image ? (
              <img
                src='/Rectangle 161.png'
                alt={yacht.name}
                className="h-[500px] w-full object-contain py-8 pr-6 rounded-[50px]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/60">
                {yacht.name}
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close enquiry form"
              className="absolute right-21 top-12 text-sm font-medium uppercase tracking-wide text-[#C9A868] transition-opacity hover:opacity-80"
            >
              Close
            </button>

            <div className="absolute right-21 top-20 flex flex-col gap-3">
              <a
                href="tel:"
                aria-label="Call"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#C9A868] shadow-md transition-colors hover:bg-[#C9A868] hover:text-white"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="tel:"
                aria-label="Call"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#C9A868] shadow-md transition-colors hover:bg-[#C9A868] hover:text-white"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}