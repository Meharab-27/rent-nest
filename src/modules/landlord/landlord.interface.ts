export interface ICreatePropertyPayload {
  title: string;
  categoryId?: string;
  description?: string;
  location: string;
  city: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  amenities?: string[];
  images?: string[];
  status?: "AVAILABLE" | "BOOKED" | "UNAVAILABLE";
}

export interface IUpdatePropertyPayload {
  title?: string;
  categoryId?: string;
  description?: string;
  location?: string;
  city?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  amenities?: string[];
  images?: string[];
  status?: "AVAILABLE" | "BOOKED" | "UNAVAILABLE";
}

export interface IUpdateRentalRequestPayload {
  status: "APPROVED" | "REJECTED";
}
