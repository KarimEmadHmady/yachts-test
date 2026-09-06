import Image from "next/image";

const IMAGES = {
  main: "/home/gallery/1-big.png",
  midTop: "/home/gallery/2.png",
  midBottom: "/home/gallery/3.png",
  rightTop: "/home/gallery/4-mid.png",
  rightBottom: "/home/gallery/5-small.png",
};

export default function MomentsGallery() {
  return (
    <section className="relative bg-[#f7f7f7] dark:bg-[#012241] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#C9A868] mb-3">
          Explore Stunning Moments
        </p>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-md leading-relaxed mb-8 transition-colors duration-300">
          Stunning Moments And Unforgettable Journey Aboard Blue Horizon
        </p>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[500px]">
          {/* Large image */}
          <div className="relative h-[280px] md:h-full rounded-2xl overflow-hidden group">
            <Image
              src={IMAGES.main}
              alt="Friends enjoying a moment on a yacht at sunset"
              fill
              className="object-cover  transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Middle column - equal split */}
          <div className="flex flex-col gap-4 md:h-full">
            <div className="relative h-[220px] md:h-auto md:flex-1 min-h-0 rounded-2xl overflow-hidden group">
              <Image
                src={IMAGES.midTop}
                alt="Motor yacht cruising near the coast"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative h-[220px] md:h-auto md:flex-1 min-h-0 rounded-2xl overflow-hidden group">
              <Image
                src={IMAGES.midBottom}
                alt="Catamaran anchored near the shore"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right column - top slightly taller than bottom */}
          <div className="flex flex-col gap-4 md:h-full">
            <div className="relative h-[220px] md:h-auto md:flex-[2] min-h-0 rounded-2xl overflow-hidden group">
              <Image
                src={IMAGES.rightTop}
                alt="Powerboat speeding across the water"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative h-[180px] md:h-auto md:flex-1 min-h-0 rounded-2xl overflow-hidden group">
              <Image
                src={IMAGES.rightBottom}
                alt="Sailboat on the open water"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}