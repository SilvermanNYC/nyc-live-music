// Aggregates events from Ticketmaster across the venue list, resolves
// artist URLs via Spotify, and caches the combined result.
//
// Caching strategy:
// - Production (Vercel): Vercel KV (Upstash Redis) - shared across all instances
// - Local dev: filesystem cache at data/event-cache.json
// - In-memory cache on top of either, for warm-instance speedups
//
// Cache lifecycle:
// - Fresh window (24h): serve cache, no refresh
// - Stale window (24h - 7d): serve cache instantly, refresh in background
// - Beyond 7d: cache miss, must rebuild (visitor waits)

import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';
import { VENUES } from '../../data/venues';
import { fetchTicketmasterEventsForVenue } from './ticketmaster';
import { resolveAllArtists } from '../artistResolver';
import type { Event } from '../types';

const CACHE_PATH = path.join(process.cwd(), 'data', 'event-cache.json');
const CACHE_KV_KEY = 'events:cache';
const CACHE_FRESH_MS = 24 * 60 * 60 * 1000;       // 24 hours
const CACHE_STALE_MS = 7 * 24 * 60 * 60 * 1000;   // 7 days
const MONTHS_AHEAD = 6;

// Detect environment
const IS_SERVERLESS = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const HAS_KV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

type EventCache = {
  fetchedAt: string;
  events: Event[];
};

// In-memory cache (fast layer - works on both serverless and local)
let memoryCache: EventCache | null = null;

async function readCache(): Promise<EventCache | null> {
  // Memory cache is fastest - try first. Use stale window so we always have something to serve.
  if (memoryCache) {
    const age = Date.now() - new Date(memoryCache.fetchedAt).getTime();
    if (age < CACHE_STALE_MS) return memoryCache;
  }

  // Try Vercel KV (production)
  if (HAS_KV) {
    try {
      const cached = await kv.get<EventCache>(CACHE_KV_KEY);
      if (cached) {
        memoryCache = cached;
        return cached;
      }
    } catch (e) {
      console.warn('[aggregate] KV read failed:', e);
    }
    return null;
  }

  // Local: read from disk
  if (!IS_SERVERLESS) {
    try {
      const raw = await fs.readFile(CACHE_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as EventCache;
      memoryCache = parsed;
      return parsed;
    } catch {
      return null;
    }
  }

  return null;
}

async function writeCache(events: Event[]) {
  const data: EventCache = { fetchedAt: new Date().toISOString(), events };

  // Always update memory
  memoryCache = data;

  // Write to KV if available (production)
  if (HAS_KV) {
    try {
      await kv.set(CACHE_KV_KEY, data, { ex: 7 * 24 * 60 * 60 });  // 7-day TTL safety net
    } catch (e) {
      console.warn('[aggregate] KV write failed:', e);
    }
    return;
  }

  // Otherwise (local dev), write to disk
  if (!IS_SERVERLESS) {
    try {
      await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
      await fs.writeFile(CACHE_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn('[aggregate] Could not persist cache to disk:', e);
    }
  }
}

// Track in-flight background refresh to avoid spawning multiple
let backgroundRefreshInFlight = false;

function startBackgroundRefresh() {
  if (backgroundRefreshInFlight) return;
  backgroundRefreshInFlight = true;
  // Fire-and-forget — don't await
  refreshAllEvents()
    .catch((e) => console.warn('[aggregate] Background refresh failed:', e))
    .finally(() => { backgroundRefreshInFlight = false; });
}

export async function getAllEvents(forceRefresh = false): Promise<{ events: Event[]; fetchedAt: string; fromCache: boolean }> {
  if (!forceRefresh) {
    const cached = await readCache();
    if (cached) {
      const age = Date.now() - new Date(cached.fetchedAt).getTime();

      // Fresh — serve from cache, no work needed
      if (age < CACHE_FRESH_MS) {
        return { events: cached.events, fetchedAt: cached.fetchedAt, fromCache: true };
      }

      // Stale but usable — serve cached data instantly, refresh in background
      if (age < CACHE_STALE_MS) {
        startBackgroundRefresh();
        return { events: cached.events, fetchedAt: cached.fetchedAt, fromCache: true };
      }
    }
  }

  // No cache or beyond stale window — visitor has to wait for fresh data
  const events = await refreshAllEvents();
  return { events, fetchedAt: new Date().toISOString(), fromCache: false };
}

export async function refreshAllEvents(): Promise<Event[]> {
  // Only fetch from venues that have a Ticketmaster ID. Indie venues
  // (ticketmasterId: null) appear in the Indie Venues section as direct links.
  const tmVenues = VENUES.filter((v) => v.ticketmasterId);
  console.log(`[aggregate] Refreshing events for ${tmVenues.length} Ticketmaster venues...`);
  const all: Event[] = [];

  // Run venues sequentially with a small delay to stay well under Ticketmaster's
  // 5 req/sec limit.
  for (const venue of tmVenues) {
    try {
      const venueEvents = await fetchTicketmasterEventsForVenue(venue, MONTHS_AHEAD);
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
