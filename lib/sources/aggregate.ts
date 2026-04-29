// Aggregates events across all sources (Ticketmaster + scrapers),
// resolves artist URLs, and caches the combined result.
//
// The event cache lives at data/event-cache.json and is refreshed
// either on a schedule (Vercel cron) or when a request comes in
// after the TTL expires.

import fs from 'fs/promises';
import path from 'path';
import { VENUES } from '../../data/venues';
import { fetchTicketmasterEventsForVenue } from './ticketmaster';
import { runScraperForVenue } from '../scrapers';
import { resolveAllArtists } from '../artistResolver';
import type { Event } from '../types';

const CACHE_PATH = path.join(process.cwd(), 'data', 'event-cache.json');
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;  // 6 hours
const MONTHS_AHEAD = 6;

type EventCache = {
  fetchedAt: string;
  events: Event[];
};

async function readCache(): Promise<EventCache | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeCache(events: Event[]) {
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  const data: EventCache = { fetchedAt: new Date().toISOString(), events };
  await fs.writeFile(CACHE_PATH, JSON.stringify(data, null, 2));
}

export async function getAllEvents(forceRefresh = false): Promise<{ events: Event[]; fetchedAt: string; fromCache: boolean }> {
  if (!forceRefresh) {
    const cached = await readCache();
    if (cached) {
      const age = Date.now() - new Date(cached.fetchedAt).getTime();
      if (age < CACHE_TTL_MS) {
        return { events: cached.events, fetchedAt: cached.fetchedAt, fromCache: true };
      }
    }
  }

  const events = await refreshAllEvents();
  return { events, fetchedAt: new Date().toISOString(), fromCache: false };
}

export async function refreshAllEvents(): Promise<Event[]> {
  console.log(`[aggregate] Refreshing events for ${VENUES.length} venues...`);
  const all: Event[] = [];

  // Run venues sequentially with a small delay to stay well under Ticketmaster's
  // 5 req/sec limit and to be polite to scraped sites.
  for (const venue of VENUES) {
    try {
      let venueEvents: Event[] = [];
      if (venue.ticketmasterId) {
        venueEvents = await fetchTicketmasterEventsForVenue(venue, MONTHS_AHEAD);
      } else if (venue.scraper) {
        venueEvents = await runScraperForVenue(venue, MONTHS_AHEAD);
      }
      all.push(...venueEvents);
    } catch (e) {
      console.warn(`[aggregate] Failed for ${venue.name}:`, e);
    }
    // 300ms between venues = ~3 req/sec, well under TM's 5/sec
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`[aggregate] Collected ${all.length} events. Resolving artist URLs...`);

  // Resolve artist URLs
  const artistMap = await resolveAllArtists(all);
  for (const e of all) {
    const r = artistMap.get(e.artistName);
    if (r) {
      e.artistUrl = r.url;
      e.artistUrlSource = r.source;
    } else {
      e.artistUrl = `https://open.spotify.com/search/${encodeURIComponent(e.artistName)}`;
      e.artistUrlSource = 'spotify-search';
    }
  }

  // Sort by date
  all.sort((a, b) => a.date.localeCompare(b.date));

  await writeCache(all);
  console.log(`[aggregate] Done. Cached ${all.length} events.`);
  return all;
}
