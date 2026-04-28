// Ticketmaster Discovery API source.
// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
//
// We query /events.json filtered by venueId and a date window, paginating
// through all results. Discovery's max page size is 200 and max page index
// is 49 (so 10,000 events per query — plenty for a single venue / 6 months).

import type { Event } from '../types';
import type { Venue } from '../../data/venues';
import { matchesAllowedGenre } from '../genres';

const BASE = 'https://app.ticketmaster.com/discovery/v2';

type TMResponse = {
  _embedded?: {
    events?: Array<{
      id: string;
      name: string;
      url: string;  // ticket purchase URL
      dates: { start: { localDate: string; localTime?: string; dateTime?: string } };
      classifications?: Array<{
        segment?: { name?: string };
        genre?: { name?: string };
        subGenre?: { name?: string };
      }>;
      _embedded?: {
        attractions?: Array<{ name: string; url?: string }>;
      };
    }>;
  };
  page?: { totalPages: number; number: number };
};

async function fetchPage(venueId: string, startDate: string, endDate: string, page: number, apiKey: string): Promise<TMResponse> {
  const params = new URLSearchParams({
    apikey: apiKey,
    venueId,
    startDateTime: `${startDate}T00:00:00Z`,
    endDateTime: `${endDate}T23:59:59Z`,
    classificationName: 'music',
    size: '100',
    page: String(page),
    sort: 'date,asc',
  });
  const url = `${BASE}/events.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) {
      // Rate limit. Wait and retry once.
      await new Promise((r) => setTimeout(r, 1500));
      const retry = await fetch(url);
      if (!retry.ok) throw new Error(`Ticketmaster ${retry.status} after retry for venue ${venueId}`);
      return retry.json();
    }
    throw new Error(`Ticketmaster ${res.status} for venue ${venueId}`);
  }
  return res.json();
}

export async function fetchTicketmasterEventsForVenue(venue: Venue, monthsAhead: number): Promise<Event[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    console.warn('TICKETMASTER_API_KEY not set; skipping Ticketmaster fetch');
    return [];
  }
  if (!venue.ticketmasterId) return [];

  const start = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + monthsAhead);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  const events: Event[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages && page < 5) {  // hard cap to avoid runaway
    const data = await fetchPage(venue.ticketmasterId, startDate, endDate, page, apiKey);
    const items = data._embedded?.events ?? [];

    for (const e of items) {
      const cls = e.classifications?.[0];
      const genre = cls?.genre?.name ?? null;
      const subGenre = cls?.subGenre?.name ?? null;
      if (!matchesAllowedGenre(genre, subGenre)) continue;

      const attraction = e._embedded?.attractions?.[0];
      const artistName = attraction?.name ?? e.name;

      events.push({
        id: e.id,
        date: e.dates.start.dateTime ?? e.dates.start.localDate,
        artistName,
        artistUrl: null, // resolved later via artist-resolver
        artistUrlSource: 'unknown',
        venueName: venue.name,
        venueWebsite: venue.website,
        venueRegion: venue.region,
        ticketUrl: e.url,
        genre: subGenre || genre,
        source: 'ticketmaster',
      });
    }

    totalPages = data.page?.totalPages ?? 1;
    page += 1;
  }

  if (events.length === 0) {
    console.warn(`[TM] No events for ${venue.name} (id=${venue.ticketmasterId}) — verify the ID is correct.`);
  }

  return events;
}
