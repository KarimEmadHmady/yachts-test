// 'use client';

// import { YachtImageGallery } from './YachtImageGallery';
// import { YachtSpecsList } from './YachtSpecsList';
// import { YachtAmenitiesList } from './YachtAmenitiesList';

// export function YachtDetailsPanel({ yacht, onUploadImages, onUpdateSpecifications, onUpdateAmenities }) {
//   if (!yacht) {
//     return (
//       <div className="rounded-2xl border border-dashed border-black/10 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A] dark:text-gray-300">
//         Select a yacht to view details.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#0E2D4A]">
//       <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//         <div>
//           <p className="text-xs uppercase tracking-[0.2em] text-[#C9A868]">Yacht details</p>
//           <h2 className="mt-2 text-2xl font-bold">{yacht.name}</h2>
//         </div>
//         <span className="rounded-full border border-[#C9A868]/40 bg-[#C9A868]/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-[#C9A868]">
//           {yacht.status || 'draft'}
//         </span>
//       </div>

//       <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
//         <div className="space-y-6">
//           <YachtImageGallery yacht={yacht} onUploadImages={onUploadImages} />
//           <YachtSpecsList yacht={yacht} onUpdateSpecifications={onUpdateSpecifications} />
//         </div>

//         <YachtAmenitiesList yacht={yacht} onUpdateAmenities={onUpdateAmenities} />
//       </div>
//     </div>
//   );
// }
