import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function ApproachSection() {
  return (
    <section className="relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text column */}
          <div className="lg:col-span-5">
            <h2
              data-reveal="up"
              data-reveal-delay="100"
              className="font-serif text-3xl sm:text-4xl font-bold text-black dark:text-white leading-tight mb-6 transition-colors duration-300"
            >
              A Holistic Approach To Yachting
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="250"
              className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed max-w-lg text-justify mb-8 transition-colors duration-300"
            >
              When It Comes To How People Feel About Boats, We Get It. We
              Understand The Thrill Of A New Building, The Excitement Of
              Escaping On A Chartered Yacht, The Anxiety Of Chartering Your
              Own.
            </p>
            <a
              href="/about"
              data-reveal="up"
              data-reveal-delay="350"
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A868] text-[#C9A868] text-sm font-medium px-6 py-3 hover:bg-white/10 transition-colors duration-200"
            >
              About Us
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Yacht image: long slide in from the right (section clips the overflow) */}
          <div className="lg:col-span-7 flex justify-end items-center">
            <div
              data-reveal="end"
              data-reveal-duration="1300"
              style={{ "--reveal-distance": "180px" } as React.CSSProperties}
              className="relative w-full h-[240px] sm:h-[320px] lg:h-[380px] group lg:-mr-12 xl:-mr-24"
            >
              <Image
                src="/home/acht-top-view.png"
                alt="Top view of a luxury yacht"
                fill
                className="object-contain object-right transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
