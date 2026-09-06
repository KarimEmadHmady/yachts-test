'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddYachtPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/edit-yacht/new');
  }, [router]);

  return (
    <div className="mt-16 min-h-screen bg-[#f7f7f7] p-6 text-black dark:bg-[#012241] dark:text-white lg:ml-64 md:ml-64 ml-0">
      <div className="mx-auto max-w-3xl rounded-2xl border border-black/10 bg-white p-6 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A]">
        Redirecting to the yacht editor...
      </div>
    </div>
  );
}
