'use client';

import { useState } from 'react';
import { search, Venue, SearchResponse } from '@/api/search';

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await search(query);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Find Your Venue
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-lg">
            Describe what you&apos;re looking for in plain English.
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Birthday party in SoHo for 40 people on Saturday evening"
            className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-base"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold px-6 py-3 text-base hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-5 py-4 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {result && (
          <>
            {/* Validation message */}
            {result.validationMessage && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-950 px-5 py-4 text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Note: </span>
                {result.validationMessage}
              </div>
            )}

            {/* Applied filters */}
            {result.appliedFilters.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  Filters applied
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.appliedFilters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium px-4 py-1.5"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Venue cards */}
            {result.venues.length === 0 ? (
              <p className="text-zinc-500 dark:text-zinc-400 text-base">
                No venues matched your request.
              </p>
            ) : (
              <>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
                  {result.venues.length} venue{result.venues.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {result.venues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col gap-4">
      {/* Name + location */}
      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 text-base leading-snug">
          {venue.name}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          · {venue.location}
        </p>
      </div>

      {/* Budget + capacity */}
      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-zinc-400 dark:text-zinc-500 block text-xs uppercase tracking-wide">
            Min budget
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {venue.minBudget != null
              ? `$${venue.minBudget.toLocaleString()}`
              : 'Flexible'}
          </span>
        </div>
        <div>
          <span className="text-zinc-400 dark:text-zinc-500 block text-xs uppercase tracking-wide">
            Max guests
          </span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {venue.maxGuestCount ?? '—'}
          </span>
        </div>
      </div>

      {/* Available days */}
      <div>
        <span className="text-zinc-400 dark:text-zinc-500 block text-xs uppercase tracking-wide mb-1">
          Available days
        </span>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {venue.availableDays.join(', ')}
        </p>
      </div>

      {/* Open times */}
      <div className="flex flex-wrap gap-1.5">
        {venue.openTimes.map((t) => (
          <span
            key={t}
            className="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 capitalize"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Occasions */}
      <div className="flex flex-wrap gap-1.5">
        {venue.occasions.map((o) => (
          <span
            key={o}
            className="rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-xs px-2.5 py-1"
          >
            {o}
          </span>
        ))}
      </div>
    </div>
  );
}
