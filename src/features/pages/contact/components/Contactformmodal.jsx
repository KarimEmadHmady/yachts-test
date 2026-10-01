'use client';

import { useState } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { leadService } from '@/services/leadService';

export default function ContactFormModal() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      await leadService.createEnquiry({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        message: form.message,
        type: 'contact',
        page_url: window.location.href,
      });
      setForm({ firstName: '', lastName: '', phone: '', email: '', message: '' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => setStatus('idle');

  return (
    <section className="relative bg-white dark:bg-[#012241] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {status === 'sent' ? (
          // Thank you card
          <div
            key="thank-you"
            data-reveal="scale"
            data-reveal-duration="450"
            className="mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#f7f7f7] dark:bg-[#0E2D4A] p-10 text-center shadow-sm sm:p-8"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center">
              <BadgeCheck className="h-16 w-16 text-white" strokeWidth={1.5} fill="#0E2D4A" />
            </div>
            <h2 className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#0E2D4A] dark:text-white sm:text-3xl">
              Thank You
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-black/50 dark:text-white/60">
              Your message has been submitted, and we will get back to you very soon.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 rounded-full border border-[#C9A868] px-6 py-2.5 text-sm text-[#C9A868] transition-colors hover:bg-[#C9A868] hover:text-white"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          // Contact form
          <div key="form" className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <form
              onSubmit={submit}
              data-reveal-stagger="80"
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  data-reveal="up"
                  data-reveal-delay="100"
                  data-reveal-duration="700"
                  required
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(event) => update({ firstName: event.target.value })}
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-[#f7f7f7] dark:bg-[#0E2D4A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 text-sm px-5 py-3.5 outline-none transition-colors focus:border-[#C9A868]"
                />
                <input
                  data-reveal="up"
                  data-reveal-delay="100"
                  data-reveal-duration="700"
                  required
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(event) => update({ lastName: event.target.value })}
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-[#f7f7f7] dark:bg-[#0E2D4A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 text-sm px-5 py-3.5 outline-none transition-colors focus:border-[#C9A868]"
                />
              </div>

              <input
                data-reveal="up"
                data-reveal-delay="100"
                data-reveal-duration="700"
                required
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(event) => update({ phone: event.target.value })}
                className="w-full rounded-full border border-black/15 dark:border-white/15 bg-[#f7f7f7] dark:bg-[#0E2D4A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 text-sm px-5 py-3.5 outline-none transition-colors focus:border-[#C9A868]"
              />

              <input
                data-reveal="up"
                data-reveal-delay="100"
                data-reveal-duration="700"
                required
                type="email"
                placeholder="E-Mail Address"
                value={form.email}
                onChange={(event) => update({ email: event.target.value })}
                className="w-full rounded-full border border-black/15 dark:border-white/15 bg-[#f7f7f7] dark:bg-[#0E2D4A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 text-sm px-5 py-3.5 outline-none transition-colors focus:border-[#C9A868]"
              />

              <textarea
                data-reveal="up"
                data-reveal-delay="100"
                data-reveal-duration="700"
                placeholder="Your Message"
                rows={6}
                value={form.message}
                onChange={(event) => update({ message: event.target.value })}
                className="w-full flex-1 min-h-[140px] resize-none rounded-[22px] border border-black/15 dark:border-white/15 bg-[#f7f7f7] dark:bg-[#0E2D4A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 text-sm px-5 py-4 outline-none transition-colors focus:border-[#C9A868]"
              />

              <div
                data-reveal="up"
                data-reveal-delay="100"
                data-reveal-duration="700"
                className="flex items-center gap-4"
              >
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A868]/60 text-[#C9A868] text-sm font-medium px-6 py-3 hover:bg-[#C9A868]/10 transition-colors duration-200 disabled:opacity-60 whitespace-nowrap"
                >
                  {status === 'sending' ? 'Sending...' : status === 'error' ? 'Retry' : 'Send'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {status === 'error' && (
                  <p className="text-xs text-red-500">Something went wrong, please try again.</p>
                )}
              </div>
            </form>

            {/* Image side */}
            <div
              data-reveal="up"
              data-reveal-delay="250"
              data-reveal-duration="900"
              className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-full overflow-hidden rounded-[24px]"
            >
              <img
                src="/contactform.png"
                alt="Guests enjoying a yacht voyage"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}