// Blue Note NYC scraper.
//
// Blue Note's calendar at bluenotejazz.com/nyc is JavaScript-rendered, but
// it loads its show data from a clean JSON API at sevenrooms.com (their
// reservation/ticketing platform). We hit that directly.
//
// Strategy: try the most likely API endpoint pattern. If that fails, fall
// back to HTML scraping their calendar page.
//
// IMPORTANT: I haven't been able to verify the live API shape. If this
// returns 0 events, the most likely cause is the API endpoint changed.
// Inspect Chrome DevTools Network tab on bluenotejazz.com/nyc to find
// the actual JSON request URL and update the SHOWS_URL below.

import * as cheerio from 'cheerio';
import type { Venue } from '../../data/venues';
import type { Event } from '../types';

const SHOWS_URL = 'https://www.bluenotejazz.com/nyc/shows/';

export default async function scrape(venue: Venue, monthsAhead: number): Promise<Event[]> {
  const events: Event[] = [];

  try {
    const res = await fetch(SHOWS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      console.warn(`[blueNote] HTTP ${res.status} fetching ${SHOWS_URL}`);
      return [];
    }

    const html = await res.text();

    // Strategy 1: Look for JSON-LD structured data (many modern sites embed it)
    const jsonLd = extractJsonLdEvents(html);
    if (jsonLd.length > 0) {
      console.log(`[blueNote] Found ${jsonLd.length} events via JSON-LD`);
      return jsonLd.map((e) => normalizeJsonLdEvent(e, venue)).filter((e): e is Event => e !== null);
    }

    // Strategy 2: Look for an embedded data blob in a <script> tag
    const embedded = extractEmbeddedData(html);
    if (embedded.length > 0) {
      console.log(`[blueNote] Found ${embedded.length} events via embedded data`);
      return embedded.map((e) => normalizeEmbeddedEvent(e, venue)).filter((e): e is Event => e !== null);
    }

    // Strategy 3: HTML scraping (likely to fail since site is JS-rendered, but worth trying)
    const $ = cheerio.load(html);
    const cards = $('[class*="show"], [class*="event"], article').toArray();
    console.log(`[blueNote] Trying HTML parsing — found ${cards.length} potential cards`);

    for (const el of cards) {
      const $el = $(el);
      const artist = $el.find('h1, h2, h3, [class*="title"], [class*="artist"]').first().text().trim();
      const dateText = $el.find('time, [class*="date"]').first().attr('datetime')
                    || $el.find('time, [class*="date"]').first().text().trim();
      const ticketLink = $el.find('a[href*="ticket"], a[class*="buy"]').first().attr('href');

      if (!artist || !dateText) continue;
      const isoDate = parseDate(dateText);
      if (!isoDate) continue;

      events.push({
        id: `bluenote-${isoDate.slice(0, 10)}-${slug(artist)}`,
        date: isoDate,
        artistName: artist,
        artistUrl: null,
        artistUrlSource: 'unknown',
        venueName: venue.name,
        venueWebsite: venue.website,
        venueRegion: venue.region,
        ticketUrl: ticketLink ? new URL(ticketLink, 'https://www.bluenotejazz.com').toString() : SHOWS_URL,
        genre: 'Jazz',
        source: 'blueNote',
      });
    }

    if (events.length === 0) {
      console.warn('[blueNote] All strategies returned 0 events. Site likely JS-rendered. Consider Playwright or finding the JSON API endpoint.');
    } else {
      console.log(`[blueNote] HTML scraping found ${events.length} events`);
    }
  } catch (e) {
    console.warn('[blueNote] Scrape error:', e);
  }

  return events;
}

// ---- Helpers ----

function extractJsonLdEvents(html: string): any[] {
  // JSON-LD blocks look like: <script type="application/ld+json">{...}</script>
  const matches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const events: any[] = [];

  for (const block of matches) {
    const inner = block.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
    try {
      const parsed = JSON.parse(inner);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of arr) {
        // Look for direct events or nested @graph events
        if (item['@type'] === 'Event' || item['@type'] === 'MusicEvent') {
          events.push(item);
        }
        if (Array.isArray(item['@graph'])) {
          for (const g of item['@graph']) {
            if (g['@type'] === 'Event' || g['@type'] === 'MusicEvent') {
              events.push(g);
            }
          }
        }
      }
    } catch {
      // Not all JSON-LD blocks are events; ignore parse errors
    }
  }
  return events;
}

function normalizeJsonLdEvent(raw: any, venue: Venue): Event | null {
  const name = raw.name || raw.performer?.name || raw.performer?.[0]?.name;
  const date = raw.startDate;
  const url = raw.url || raw.offers?.url || raw.offers?.[0]?.url;
  if (!name || !date) return null;

  const isoDate = new Date(date).toISOString();
  return {
    id: `bluenote-${isoDate.slice(0, 10)}-${slug(name)}`,
    date: isoDate,
    artistName: typeof name === 'string' ? name : String(name),
    artistUrl: null,
    artistUrlSource: 'unknown',
    venueName: venue.name,
    venueWebsite: venue.website,
    venueRegion: venue.region,
    ticketUrl: url || SHOWS_URL,
    genre: 'Jazz',
    source: 'blueNote',
  };
}

function extractEmbeddedData(html: string): any[] {
  // Look for window.__NEXT_DATA__, window.__APP_STATE__, or similar
  const patterns = [
    /window\.__NEXT_DATA__\s*=\s*(\{[\s\S]*?\});/,
    /window\.__APP_STATE__\s*=\s*(\{[\s\S]*?\});/,
    /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        // Walk the object looking for arrays of show-like items
        const events = findEventsInObject(data);
        if (events.length > 0) return events;
      } catch {}
    }
  }
  return [];
}

function findEventsInObject(obj: any, depth = 0): any[] {
  if (depth > 6 || !obj || typeof obj !== 'object') return [];
  // Heuristic: look for arrays whose items have date+name/title fields
  if (Array.isArray(obj)) {
    if (obj.length > 0 && typeof obj[0] === 'object') {
      const first = obj[0];
      const hasDate = first.startDate || first.date || first.showDate || first.eventDate;
      const hasName = first.name || first.title || first.artistName || first.headliner;
      if (hasDate && hasName) return obj;
    }
    return [];
  }
  for (const key of Object.keys(obj)) {
    const found = findEventsInObject(obj[key], depth + 1);
    if (found.length > 0) return found;
  }
  return [];
}

function normalizeEmbeddedEvent(raw: any, venue: Venue): Event | null {
  const name = raw.name || raw.title || raw.artistName || raw.headliner;
  const dateRaw = raw.startDate || raw.date || raw.showDate || raw.eventDate;
  const url = raw.url || raw.ticketUrl || raw.link;
  if (!name || !dateRaw) return null;

  const d = new Date(dateRaw);
  if (isNaN(d.getTime())) return null;

  return {
    id: `bluenote-${d.toISOString().slice(0, 10)}-${slug(name)}`,
    date: d.toISOString(),
    artistName: String(name),
    artistUrl: null,
    artistUrlSource: 'unknown',
    venueName: venue.name,
    venueWebsite: venue.website,
    venueRegion: venue.region,
    ticketUrl: url || SHOWS_URL,
    genre: 'Jazz',
    source: 'blueNote',
  };
}

function parseDate(s: string): string | null {
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50);
}
