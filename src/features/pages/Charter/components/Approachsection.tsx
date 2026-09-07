import Image from "next/image";
import { ScrollAnimate } from "@/components/common/ScrollAnimate";

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

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text column */}
          <div className="lg:col-span-5">
            <ScrollAnimate direction="up" delay={100}>
              <h2 className="font-serif text-2xl sm:text-5xl font-bold text-black dark:text-white leading-tight mb-6 transition-colors duration-300 uppercase">
                coming soon
              </h2>
            </ScrollAnimate>
            <ScrollAnimate direction="up" delay={250}>
              <p className="text-sm sm:text-base text-gray-700 dark:text-white/80 leading-relaxed max-w-lg text-justify mb-8 transition-colors duration-300">
                We are currently in the process of maintaining and upgrading our fleet to ensure the highest standards of luxury and safety. We apologize for this temporary pause and will return to welcome your bookings very soon with a brand new collection of yachts.
              </p>
            </ScrollAnimate>
          </div>

          {/* Yacht image */}
          <div className="lg:col-span-7 flex justify-end items-center">
            <ScrollAnimate
              direction="right"
              distance={180}
              duration={1300}
              className="relative w-full h-[240px] sm:h-[300px] lg:h-[360px] group lg:-mr-10 xl:-mr-20"
            >
              <Image
                src="/home/acht-top-view.png"
                alt="Top view of a luxury yacht"
                fill
                className="object-contain object-right transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </section>
  );
}