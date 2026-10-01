import { ArrowUpRight } from "lucide-react";

export default function YachtingHero() {
  return (
    <section className="relative bg-white text-black dark:bg-[#012241] dark:text-white transition-colors duration-300 overflow-hidden">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 px-6 md:px-12 py-14 md:py-20 items-start">
        {/* Left column — copy */}
        <div>
          <h2
            data-reveal="up"
            data-reveal-delay="50"
            className="font-serif text-3xl md:text-4xl leading-tight tracking-tight mb-8 text-black dark:text-white"
          >
            A Holistic Approach To Yachting
          </h2>

          <div
            data-reveal="up"
            data-reveal-delay="180"
            className="space-y-5 text-sm md:text-[15px] leading-relaxed text-black/70 dark:text-white/70"
          >
            <p>
              We are a marine company built around a simple idea: yacht
              ownership should feel effortless, personal, and well supported
              at every stage.
            </p>

            <p>
              A key part of our work is acting as an authorized dealer for
              selected international yacht manufacturers, giving clients
              direct access to new builds and factory-supported ownership.
              Alongside this, we operate across brokerage, technical service,
              maintenance coordination, and long-term marine support.
            </p>

            <p>
              Our approach is selective rather than volume-driven. We focus
              on vessels and solutions that meet clear standards of design,
              performance, and long-term usability, ensuring every
              recommendation is grounded in real ownership experience.
            </p>

            <p>
              We support both experienced owners and those new to yachting,
              helping them navigate decisions with clarity and confidence.
              Whether sailing or motor, new or pre-owned, our role remains
              consistent: to provide informed guidance and reliable
              execution.
            </p>

            <p>
              Yacht ownership is not just about acquisition. It is about
              continuity — how a vessel is supported, maintained, and
              experienced over time. Our responsibility is to keep that
              experience structured, transparent, and professionally managed
              from first enquiry through long-term ownership.
            </p>
          </div>

          <button
            type="button"
            data-reveal="up"
            data-reveal-delay="300"
            className="group mt-9 inline-flex items-center gap-2 rounded-full border border-[#C9A868]
                       px-5 py-2.5 text-sm font-medium text-black dark:text-white
                       hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-[#0E2D4A]
                       transition-colors duration-200"
          >
            <span className="font-semibold text-[#C9A868] group-hover:text-white dark:group-hover:text-[#0E2D4A]">
              Models
            </span>
            <ArrowUpRight className="h-4 w-4 text-[#C9A868]" strokeWidth={2} />
          </button>
        </div>

        {/* Right column — image */}
        <div
          data-reveal="up"
          data-reveal-delay="220"
          data-reveal-duration="900"
          className="relative w-full aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden group"
        >
          {/* Replace the src below with your own yacht/lifestyle photo */}
          <img
            src="/about/about-page.png"
            alt="Guests enjoying dinner on the deck of a yacht at sunset"
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
