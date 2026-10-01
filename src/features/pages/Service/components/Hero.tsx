import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-[#f7f7f7] text-black dark:bg-[#0E2D4A] dark:text-white rounded-b-[30px] overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
        {/* Image card */}
        <div
          data-reveal="up"
          data-reveal-duration="900"
          className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] rounded-[24px] overflow-hidden"
        >
          <Image
            src="/home/hero-yacht.png"
            alt="Woman enjoying a marine escape on a yacht deck"
            fill
            priority
            className="object-cover hero-zoom-out"
          />

          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Text overlay */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
            <p data-reveal="up" data-reveal-delay="200" className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-[#C9A868] mb-2">
              Discover
            </p>

            <h1 data-reveal="up" data-reveal-delay="350" className="text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-wide text-white max-w-xl leading-snug">
              The Brilliance Of Marine Escapes
            </h1>
          </div>
        </div>

        {/* Description */}
        <p data-reveal="up" data-reveal-delay="500" className="text-sm text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed mt-6 transition-colors duration-300">
          <span className="font-semibold text-black dark:text-white">
            Blue Horizon
          </span>{" "}
          Marine Concepts Provides Premium Marine Solutions, Combining Luxury
          Design, Precision Engineering And Bespoke Service To Create
          Unforgettable Experiences On The Water
        </p>
      </div>
    </section>
  );
}