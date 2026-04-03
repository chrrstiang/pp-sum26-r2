import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

interface Venue {
  id: number;
  name: string;
  minBudget: number | null;
  maxGuestCount: number | null;
  location: string;
  availableDays: string[];
  openTimes: string[];
  occasions: string[];
}

interface ExtractedFilters {
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

@Injectable()
export class VenueService {
  private venues: Venue[];
  private openai: OpenAI;

  constructor() {
    const venuesPath = path.resolve(process.cwd(), '../venues.json');
    this.venues = JSON.parse(fs.readFileSync(venuesPath, 'utf-8'));
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async searchVenues(query: string): Promise<SearchResponse> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Extract venue search filters from the user's natural language query. Return a JSON object with these fields (use null for any not mentioned):
- budget: number or null (budget in dollars)
- guestCount: number or null (number of guests)
- location: string or null (neighborhood, e.g. "SoHo", "Brooklyn", "Midtown")
- day: string or null (day of week, e.g. "Saturday")
- time: string or null (one of: morning, afternoon, evening, night)
- occasion: string or null (e.g. Birthday, Wedding, Office Party, Anniversary)`,
        },
        { role: 'user', content: query },
      ],
    });

    const filters: ExtractedFilters = JSON.parse(
      completion.choices[0].message.content ?? '{}',
    );

    const message = completion.choices[0].message;

    console.log('Completion:', JSON.parse(message.content || '{}'));
    console.log('Filters:', filters);

    // Build human-readable filter labels
    const appliedFilters: string[] = [];
    if (filters.budget != null)
      appliedFilters.push(`Budget: $${filters.budget.toLocaleString()}`);
    if (filters.guestCount != null)
      appliedFilters.push(`Guests: ${filters.guestCount}`);
    if (filters.location) appliedFilters.push(`Location: ${filters.location}`);
    if (filters.day) appliedFilters.push(`Day: ${filters.day}`);
    if (filters.time) appliedFilters.push(`Time: ${filters.time}`);
    if (filters.occasion) appliedFilters.push(`Occasion: ${filters.occasion}`);

    // Validation rules
    const weekendDays = ['Friday', 'Saturday', 'Sunday'];
    if (
      filters.day &&
      weekendDays.includes(filters.day) &&
      filters.budget != null &&
      filters.budget < 2000
    ) {
      return {
        venues: [],
        appliedFilters,
        validationMessage: `Weekend bookings require a minimum budget of $2,000. Your budget of $${filters.budget.toLocaleString()} does not meet this requirement. Try increasing your budget or choosing a weekday.`,
      };
    }
    if (filters.guestCount != null && filters.guestCount > 150) {
      return {
        venues: [],
        appliedFilters,
        validationMessage: `No venues accommodate more than 150 guests. Try searching for a guest count of 150 or fewer.`,
      };
    }

    // Filter venues
    let results = [...this.venues];

    if (filters.budget != null) {
      results = results.filter(
        (v) => v.minBudget == null || v.minBudget <= filters.budget!,
      );
    }
    if (filters.guestCount != null) {
      results = results.filter(
        (v) =>
          v.maxGuestCount == null || v.maxGuestCount >= filters.guestCount!,
      );
    }
    if (filters.location) {
      results = results.filter(
        (v) => v.location.toLowerCase() === filters.location!.toLowerCase(),
      );
    }
    if (filters.day) {
      results = results.filter((v) => v.availableDays.includes(filters.day!));
    }
    if (filters.time) {
      results = results.filter((v) =>
        v.openTimes.includes(filters.time!.toLowerCase()),
      );
    }
    if (filters.occasion) {
      results = results.filter((v) =>
        v.occasions.some(
          (o) => o.toLowerCase() === filters.occasion!.toLowerCase(),
        ),
      );
    }

    return { venues: results, appliedFilters };
  }
}
