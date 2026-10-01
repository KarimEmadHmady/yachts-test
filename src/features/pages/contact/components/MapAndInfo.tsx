'use client';

import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: TikTokIcon, href: '#', label: 'TikTok' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Phone, href: 'tel:+966984858584949', label: 'Call' },
];

const INFO_CARDS = [
  {
    icon: MapPin,
    title: 'Address',
    lines: ['Riyadh 12244. Saudi Arabia 256777, Riyadh As Sulaymaniyah'],
  },
  {
    icon: Phone,
    title: 'Phone Number',
    lines: ['+966 984858584949'],
  },
  {
    icon: Mail,
    title: 'E-Mail',
    lines: ['example@gmail.com'],
  },
];

export default function ContactUs() {
  return (
    <section className="relative bg-white dark:bg-[#012241] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}
        <h1
          data-reveal="up"
          data-reveal-delay="50"
          className="font-serif font-bold text-2xl sm:text-3xl text-black dark:text-white mb-3"
        >
          Contact Us
        </h1>

        <p
          data-reveal="up"
          data-reveal-delay="150"
          className="text-sm text-black/70 dark:text-white/70 leading-relaxed max-w-2xl mb-8"
        >
          Whether You&apos;re Planning Your Next Voyage Or Need Expert Marine Support,
          Our Team Is Ready To Assist You. Get In Touch With Us And Experience
          Premium Service Tailored To Your Maritime Needs.
        </p>

        {/* Map */}
        <div
          data-reveal="up"
          data-reveal-delay="200"
          data-reveal-duration="900"
          className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] rounded-[16px] sm:rounded-[24px] overflow-hidden border border-white/10"
        >
          <iframe
            title="Our Location"
            src="https://www.google.com/maps?q=Riyadh%20As%20Sulaymaniyah%2C%20Riyadh&output=embed"
            className="absolute inset-0 h-full w-full grayscale-0"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Social rail */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-5 flex flex-col gap-2.5 sm:gap-3 z-10">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#C9A868] text-[#0E2D4A] shadow-md transition-transform duration-200 hover:scale-110 hover:bg-white"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div data-reveal-stagger="120" className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-8">
          {INFO_CARDS.map(({ icon: Icon, title, lines }) => (
            <div
              key={title}
              data-reveal="up"
              data-reveal-duration="850"
              className="rounded-[18px] border border-white/10 bg-[#f7f7f7] dark:bg-[#0E2D4A] px-6 py-8 text-center transition-colors duration-300"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A868] text-[#0E2D4A]">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-black dark:text-white mb-2">
                {title}
              </h3>
              {lines.map((line) => (
                <p
                  key={line}
                  className="text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TikTokIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}