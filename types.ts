export interface Venue {
  id: number;
  name: string;
  minBudget: number | null;
  maxGuestCount: number | null;
  location: string;
  availableDays: string[];
  openTimes: string[];
  occasions: string[];
}

export interface ExtractedFilters {
  budget?: number | null;
  guestCount?: number | null;
  location?: string | null;
  day?: string | null;
  time?: string | null;
  occasion?: string | null;
}

export interface SearchResponse {
  venues: Venue[];
  appliedFilters: string[];
  validationMessage?: string;
}
