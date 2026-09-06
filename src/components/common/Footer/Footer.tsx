import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone } from "lucide-react";

async function getFooterContent() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/page-content/footer?lang=en`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.content?.footer ?? null;
  } catch {
    return null;
  }
}

const FALLBACK = {
  logoImage: "/logo.png",
  description:
    "Blue Horizon Marine Concepts provides premium marine solutions, combining luxury design, precision engineering and bespoke service to create unforgettable experiences on the water.",

  infoTitle: "Info",
  homeLinkText: "Home Page",
  aboutLinkText: "About Us",
  yachtsLinkText: "Yachts",

  yachtsTitle: "Yachts",
  jeanneauLinkText: "Jeanneau Yachts",
  baliLinkText: "Bali Catamarans",
  saffierLinkText: "Saffier Elegance",

  othersTitle: "Others",
  eventsLinkText: "Events & News",
  contactLinkText: "Contact Us",

  contactTitle: "Get In Touch",
  phoneNumber: "+201202218387",
  facebookUrl: "#",
  instagramUrl: "#",
  tiktokUrl: "#",
  whatsappUrl: "#",

  copyrightText: "Copyright © 2026 Blue Horizon Company",
  developedByText: "Designed By",
  developedByUrl: "https://uwd.dev/",
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-1.02-.88-1.6-2.15-1.6-3.55h-3.13v13.13c0 1.55-1.25 2.8-2.8 2.8a2.8 2.8 0 010-5.6c.28 0 .55.04.8.11V9.5a5.94 5.94 0 00-.8-.05 5.93 5.93 0 105.93 5.93V9.4a8.2 8.2 0 004.8 1.54V7.8a4.85 4.85 0 01-3.2-1.98z" />
    </svg>
  );
}

export default async function Footer() {
  const content = (await getFooterContent()) ?? FALLBACK;
  const footer = { ...FALLBACK, ...content };
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

  const socials = [
    { href: footer.facebookUrl, Icon: Facebook, label: "Facebook" },
    { href: footer.instagramUrl, Icon: Instagram, label: "Instagram" },
    { href: footer.tiktokUrl, Icon: TikTokIcon, label: "TikTok" },
    { href: footer.whatsappUrl, Icon: Phone, label: "WhatsApp" },
  ];

  return (
    <footer className="relative bg-[#f7f7f7] text-black dark:bg-[#0E2D4A] dark:text-white rounded-t-[30px] overflow-hidden transition-colors duration-300">
      {/* Decorative pattern watermark */}
      <Image
        src="/pattern.png"
        alt=""
        width={256}
        height={256}
        className="pointer-events-none select-none absolute -right-4 bottom-0 z-0 w-64 h-64 object-contain brightness-0  dark:brightness-100 "
      />

      

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          {/* Logo + description */}
          <div className="md:col-span-1 flex flex-col items-start">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Blue Horizon Marine Concepts"
                width={140}
                height={45}
              />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs leading-relaxed">
              <span className="font-semibold text-black dark:text-white">Blue Horizon</span>{" "}
              {footer.description.replace(/^Blue Horizon\s*/i, "")}
            </p>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white mb-4 tracking-wide uppercase">
              {footer.infoTitle}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {footer.homeLinkText}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {footer.aboutLinkText}
                </Link>
              </li>
              <li>
                <Link href="/yachts" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {footer.yachtsLinkText}
                </Link>
              </li>
            </ul>
          </div>

          {/* Yachts */}
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white mb-4 tracking-wide uppercase">
              {footer.yachtsTitle}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/yachts/jeanneau" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {footer.jeanneauLinkText}
                </Link>
              </li>
              <li>
                <Link href="/yachts/bali" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {footer.baliLinkText}
                </Link>
              </li>
              <li>
                <Link href="/yachts/saffier" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                  {footer.saffierLinkText}
                </Link>
              </li>
            </ul>
          </div>

          {/* Others + Get in touch */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white mb-4 tracking-wide uppercase">
                {footer.othersTitle}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/events" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    {footer.eventsLinkText}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                    {footer.contactLinkText}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-black dark:text-white mb-4 tracking-wide uppercase">
                {footer.contactTitle}
              </h3>
              <a
                href={`tel:${footer.phoneNumber}`}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors block mb-4"
              >
                {footer.phoneNumber}
              </a>
              <div className="flex items-center gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#C9A868] text-[#0E2D4A] hover:opacity-90 transition-opacity"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10 dark:border-white/10" />

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-1 text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {footer.copyrightText}{" "}
            <span className="text-gray-700 dark:text-gray-300">{footer.developedByText}</span>{" "}
            <a
              href={footer.developedByUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A868] hover:text-black dark:hover:text-white transition-colors font-medium"
            >
              UWD
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}