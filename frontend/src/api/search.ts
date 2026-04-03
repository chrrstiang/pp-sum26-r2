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

export async function search(query: string): Promise<SearchResponse> {
  const res = await fetch('http://localhost:8000/venues/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
