import Image from "next/image";

const BRANDS = [
  {
    name: "Bali Catamarans",
    src: "/home/brands/bali24.png",
    width: 190,
    height: 90,
  },
  {
    name: "Jeanneau",
    src: "/home/brands/Jeanneau-2-13.png",
    width: 190,
    height: 90,
  },
  {
    name: "Saffier Yachts",
    src: "/home/brands/bali44.png",
    width: 190,
    height: 90,
  },
];

export default function BrandsStrip() {
  return (
    <section className="relative bg-white dark:bg-[#012241] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div data-reveal-stagger="150" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              data-reveal="up"
              className="group flex items-center justify-center h-28 sm:h-28 rounded-2xl bg-gray-200 dark:bg-gray-200 overflow-hidden cursor-pointer"
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.width}
                height={brand.height}
                className="object-contain max-h-24 w-auto transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
