// Registry of venue scrapers. Each scraper exports a default function
// that takes a Venue and returns Event[].
//
// Scrapers are best-effort. They will break when sites redesign. If you
// see a scraper consistently returning 0 events for a venue that clearly
// has shows, the scraper needs updating.
//
// To add a new scraper:
//   1. Create a new file in lib/scrapers/ (e.g. blueNote.ts)
//   2. Export a default async function (venue: Venue) => Promise<Event[]>
//   3. Add it to SCRAPER_REGISTRY below
//   4. Set the venue's `scraper` field in data/venues.ts to its key

import type { Venue } from '../../data/venues';
import type { Event } from '../types';

import blueNote from './blueNote';
import villageVanguard from './villageVanguard';
import stub from './stub';

export type ScraperFn = (venue: Venue, monthsAhead: number) => Promise<Event[]>;

export const SCRAPER_REGISTRY: Record<string, ScraperFn> = {
  blueNote,
  villageVanguard,

  // Stubs — return [] until you implement them.
  // Each one is a 30-60 line task: fetch the venue's calendar URL, parse
  // event listings with cheerio, return Event[].
  birdland: stub,
  smalls: stub,
  dizzys: stub,
  smoke: stub,
  lunatico: stub,
  babysAllRight: stub,
  elsewhere: stub,
  unionPool: stub,
  pianos: stub,
  rockwood: stub,
  poissonRouge: stub,
  boweryElectric: stub,
  cityWineryNYC: stub,
  racket: stub,
  knockdownCenter: stub,
  levonHelm: stub,
  bearsville: stub,
  darylsHouse: stub,
  tanglewood: stub,
};

export async function runScraperForVenue(venue: Venue, monthsAhead: number): Promise<Event[]> {
  if (!venue.scraper) return [];
  const fn = SCRAPER_REGISTRY[venue.scraper];
  if (!fn) {
    console.warn(`No scraper registered for "${venue.scraper}" (venue: ${venue.name})`);
    return [];
  }
  try {
    return await fn(venue, monthsAhead);
  } catch (e) {
    console.warn(`Scraper "${venue.scraper}" failed for ${venue.name}:`, e);
    return [];
  }
}
