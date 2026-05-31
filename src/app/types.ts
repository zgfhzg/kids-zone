export interface KidsZone {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  website?: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: number;
  openHours: string;
  price: string;
  facilities: string[];
  reviews: Review[];
}

export interface Review {
  rating: number;
  author: string;
  date: string;
  comment: string;
}
