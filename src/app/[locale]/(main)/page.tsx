import { Hero , BrandsStrip , ApproachSection , MomentsGallery , BlogsSection, ContactCta} from '@/features/pages/home/components/index';
export default function Home() {
  return (
    <div>
      <Hero />
      <BrandsStrip />
      <ApproachSection />
      <MomentsGallery />
      <BlogsSection />
      <ContactCta />
    </div>
  );
}