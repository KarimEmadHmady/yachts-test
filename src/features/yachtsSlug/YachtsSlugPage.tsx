'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useYachtBySlug } from '@/features/yachtsSlug/hooks/useYachtBySlug';
import { YachtGallerySection } from '@/features/yachtsSlug/components/YachtGallerySection';
import { YachtLayoutsSection } from '@/features/yachtsSlug/components/YachtLayoutsSection';
import { YachtSpecificationsSection } from '@/features/yachtsSlug/components/YachtSpecificationsSection';
import { YachtEnquiryForm } from '@/features/yachtsSlug/components/YachtEnquiryForm';

interface YachtSlugPageProps {
  params: { slug: string };
}
 
export default function YachtSlugPage({ params }: YachtSlugPageProps) {
  const router = useRouter();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const { yacht, isLoading, error } = useYachtBySlug(params.slug);
 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] px-6 py-10 dark:bg-[#0E2D4A] md:px-12">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-8 w-1/3 rounded bg-black/10 dark:bg-white/10" />
          <div className="aspect-[16/7] w-full rounded-2xl bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    );
  }
 
  if (error || !yacht) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-6 text-black dark:bg-[#0E2D4A] dark:text-white">
        <p className="text-sm text-black/60 dark:text-white/60">
          {error || 'Yacht not found.'}
        </p>
      </div>
    );
  }
 
  const layoutImages = yacht.images
    .filter((img) => img.image_type === 'layout')
    .slice(0, 3)
    .map((img) => img.image_path);
 
  const interiorImages = yacht.images
    .filter((img) => img.image_type === 'interior')
    .slice(0, 8)
    .map((img) => img.image_path);
 
  return (
    <div className="min-h-screen">
      <YachtGallerySection yacht={yacht} onBack={() => router.back()} />
      <YachtSpecificationsSection
        yacht={yacht}
        interiorImages={interiorImages}
        onEnquire={() => setIsEnquiryOpen(true)}
      />
      <YachtEnquiryForm yacht={yacht} isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
      <YachtLayoutsSection images={layoutImages} />
    </div>
  );
}