
'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 900);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Scroll to top"
        className={`group fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer 
  border border-[#C9A868]
  shadow-[0_8px_24px_rgba(14,45,74,0.25)]
  dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)]
  transition-all duration-300 ease-out
  hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(201,168,104,0.35)]
  ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
`}
      >
        {/* light mood */}
        <span
          className="absolute inset-0 rounded-full bg-cover bg-center block dark:hidden"
          style={{
            backgroundImage:
              "url('https://64.media.tumblr.com/0e0ca0386f73c41604556382f5519d33/63e33ca5586600e7-ac/s500x750/0a87761df022a3e6cdbd517c2cbd5b517fb7cac8.gif')",
          }}
        />
        {/* dark mode */}
        <span
          className="absolute inset-0 rounded-full bg-cover bg-center hidden dark:block"
          style={{
            backgroundImage:
              
               "url('https://giffiles.alphacoders.com/151/151220.gif')",
          }}
        />

        <span className="relative flex items-center justify-center w-full h-full overflow-visible rounded-full">
          <Image
            src="/totop.png"
            alt=""
            width={60}
            height={60}
            className={`w-14 h-14 object-contain transition-transform duration-300 ease-out group-hover:-translate-y-3 group-hover:scale-125 ${
              animating ? "animate-sail" : ""
            }`}
          />
        </span>
      </button>

      <style jsx>{`
        @keyframes sail-away {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          45% {
            transform: translateY(-26px) rotate(-10deg);
            opacity: 0;
          }
          55% {
            transform: translateY(26px) rotate(10deg);
            opacity: 0;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
        }
        .animate-sail {
          animation: sail-away 0.9s ease-in-out;
        }
      `}</style>
    </>
  );
}