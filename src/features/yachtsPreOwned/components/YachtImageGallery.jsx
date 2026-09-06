import { getYachtImageUrl } from '../utils/yacht.utils';

export function YachtImageGallery({ images = [], alt = 'Yacht' }) {
  if (!images.length) return <div className="yacht-image-gallery__empty">No images available</div>;

  return (
    <div className="yacht-image-gallery">
      {images.map((image) => (
        <img
          key={image.id || image.image_path}
          src={getYachtImageUrl(image.image_path)}
          alt={alt}
          loading="lazy"
        />
      ))}
    </div>
  );
}
