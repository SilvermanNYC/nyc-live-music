// Village Vanguard scraper.
// Their site is simpler than Blue Note's — mostly server-rendered HTML.
// This scraper looks at the schedule page and parses entries.
//
// Same caveat as blueNote.ts: refine selectors against the real site.

import * as cheerio from 'cheerio';
import type { Venue } from '../../data/venues';
import type { Event } from '../types';

export default async function scrape(venue: Venue, _monthsAhead: number): Promise<Event[]> {
  const events: Event[] = [];

  try {
    const res = await fetch('https://villagevanguard.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NYCLiveMusicBot/1.0)' },
    });
    if (!res.ok) {
      console.warn(`[villageVanguard] HTTP ${res.status}`);
      return [];
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Village Vanguard typically lists upcoming weeks with dates and artists
    $('.calendar-row, .event, article').each((_, el) => {
      const $el = $(el);
      const artistName = $el.find('.artist, h2, h3, .title').first().text().trim();
      const dateStr = $el.find('time, .date').first().text().trim();

      if (!artistName || !dateStr) return;

      const isoDate = parseDate(dateStr);
      if (!isoDate) return;

      events.push({
        id: `vanguard-${isoDate}-${artistName.replace(/\s+/g, '-')}`.toLowerCase(),
        date: isoDate,
        artistName,
        artistUrl: null,
        artistUrlSource: 'unknown',
        venueName: venue.name,
        venueWebsite: venue.website,
        venueRegion: venue.region,
        ticketUrl: 'https://villagevanguard.com/',
        genre: 'Jazz',
        source: 'villageVanguard',
      });
    });
  } catch (e) {
    console.warn('[villageVanguard] scrape error:', e);
  }

  return events;
}

function parseDate(s: string): string | null {
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString();
  return null;
}
