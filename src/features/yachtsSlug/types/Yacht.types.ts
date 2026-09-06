export type YachtConditionType = 'new' | 'pre-owned' | string;
export type YachtListingType = 'sale' | 'charter' | string;
export type YachtStatus = 'published' | 'draft' | string;

export interface YachtSpecification {
  id: number;
  yacht_id: number;
  spec_group: 'specification' | 'characteristic' | string;
  label: string;
  value: string;
  sort_order: number;
}

export interface YachtAmenity {
  id: number;
  name: string;
  icon?: string | null;
}

export type YachtImageType = 'cover' | 'gallery' | 'interior' | 'layout' | string;

export interface YachtImage {
  id?: number;
  yacht_id?: number;
  image_path: string;
  image_type?: YachtImageType;
  sort_order?: number;
  created_at?: string;
}

export interface Yacht {
  id: number;
  name: string;
  slug: string;
  brand_id: number | null;
  category_id: number | null;
  type: string;
  condition_type: YachtConditionType;
  listing_type: YachtListingType;
  price_sale: string | null;
  price_charter: string | null;
  price_charter_period: string | null;
  currency: string;
  size_meters: string | null;
  cabins: number | null;
  year_built: number | null;
  description: string | null;
  video_url: string | null;
  status: YachtStatus;
  source: string;
  submission_status: string;
  submitted_by_first_name: string | null;
  submitted_by_last_name: string | null;
  submitted_brand_name: string | null;
  submitted_message: string | null;
  created_at: string;
  updated_at: string;
  cover_image: string | null;
  images: YachtImage[];
  specifications: YachtSpecification[];
  amenities: YachtAmenity[];
}