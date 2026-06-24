export interface City {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface Property {
  id: number;
  name: string;
  slug: string;
  images?: string[];
  lowest_price?: number;
  price_single?: number;
  price_double?: number;
  price_triple?: number;
  locality?: string;
  city_name: string;
  city_slug: string;
  amenities?: string[];
  is_featured?: boolean;
  is_trusted?: boolean;
  is_unverified?: boolean;
  views?: number;
  description?: string;
  map_link?: string;
  owner_mobile?: string;
}

export interface LeadPayload {
  name: string;
  mobile: string;
  message: string;
}

export interface EventPayload {
  mobile: string;
  city?: string;
  property_id?: number;
  event_type: 'city_visit' | 'property_view';
}

export interface ImpressionPayload {
  ids: number[];
}
