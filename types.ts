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

export interface SearchResponse {
  venues: Venue[];
  appliedFilters: string[];
  validationMessage?: string;
}
