import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from 'next/link';

export default function ApproachSection() {
  return (
    <section className="relative overflow-hidden m-6 md:m-16 rounded-2xl">
      {/* Background wave image */}
      <Image
        src="/home/wave-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center z-10 pointer-events-none"
      />
      {/* Subtle darken for text legibility */}
      <div className="absolute inset-0 bg-[#0E2D4A]/30 -z-10" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-10 items-center">
          {/* Text column */}
          <div>
            <h2 className="font-serif text-2xl  sm:text-5xl font-bold text-black dark:text-white leading-tight mb-6 transition-colors duration-300 uppercase">
             coming soon
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed max-w-lg text-justify mb-8 transition-colors duration-300">
            We are currently in the process of maintaining and upgrading our fleet to ensure the highest standards of luxury and safety. We apologize for this temporary pause and will return to welcome your bookings very soon with a brand new collection of yachts.

            </p>

          </div>

          {/* Yacht image */}
<div className="relative w-full h-[220px] sm:h-[300px] lg:h-[340px] group overflow-hidden">
  <Image
    src="/home/acht-top-view.png"
    alt="Top view of a luxury yacht"
    fill
    className="object-contain transition-transform duration-500 ease-out group-hover:scale-103"
  />
</div>
        </div>
      </div>
    </section>
  );
}