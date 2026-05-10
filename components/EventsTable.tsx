'use client';

import { useMemo, useState } from 'react';
import type { Event } from '../lib/types';

const REGION_LABELS: Record<string, string> = {
  NY: 'New York',
  NJ: 'New Jersey',
  CT: 'Connecticut',
  MA: 'Massachusetts',
  PA: 'Pennsylvania',
};

function formatDateParts(iso: string): { day: string; num: string } {
  // Force UTC so server-rendered HTML matches client (avoid hydration mismatch)
  const date = new Date(iso);
  if (isNaN(date.getTime())) return { day: '', num: iso };
  const day = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const dayNum = date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'UTC' });
  return { day, num: `${month} ${dayNum}` };
}

export default function EventsTable({ events }: { events: Event[] }) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string>('all');
  const [venue, setVenue] = useState<string>('all');
  const [genre, setGenre] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const venues = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.venueName))).sort();
  }, [events]);

  const genres = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.genre).filter((g): g is string => !!g))).sort();
  }, [events]);

  const regions = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.venueRegion))).sort();
  }, [events]);

  const filtered = useMemo(() => {
    let out = events;
    if (region !== 'all') out = out.filter((e) => e.venueRegion === region);
    if (venue !== 'all') out = out.filter((e) => e.venueName === venue);
    if (genre !== 'all') out = out.filter((e) => e.genre === genre);
    if (dateFrom) out = out.filter((e) => e.date >= dateFrom);
    if (dateTo) out = out.filter((e) => e.date <= dateTo);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (e) => {
          const regionLabel = (REGION_LABELS[e.venueRegion] ?? e.venueRegion).toLowerCase();
          return (
            e.artistName.toLowerCase().includes(q) ||
            e.venueName.toLowerCase().includes(q) ||
            (e.genre ?? '').toLowerCase().includes(q) ||
            regionLabel.includes(q) ||
            e.venueRegion.toLowerCase().includes(q)
          );
        }
      );
    }
    out = [...out].sort((a, b) => a.date.localeCompare(b.date));
    return out;
  }, [events, region, venue, genre, search, dateFrom, dateTo]);

  return (
    <>
      <div className="controls">
        <div className="control">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search artists, venues, genres"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="date-from">From</label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="date-to">To</label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="region">Region</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{REGION_LABELS[r] ?? r}</option>
            ))}
          </select>
        </div>
        <div className="control">
          <label htmlFor="venue">Venue</label>
          <select id="venue" value={venue} onChange={(e) => setVenue(e.target.value)}>
            <option value="all">All venues</option>
            {venues.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="control">
          <label htmlFor="genre">Genre</label>
          <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="all">All genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <a href="#indie-venues" className="indie-button-inline">
          Indie venues →
        </a>
        <div className="results-count">
          {filtered.length} {filtered.length === 1 ? 'show' : 'shows'}
        </div>
      </div>

      <table className="listings">
        <tbody>
          {filtered.map((ev) => {
            const { day, num } = formatDateParts(ev.date);
            return (
              <tr key={ev.id}>
                <td className="cell-date">
                  <div className="cell-date-day">{day}</div>
                  <div className="cell-date-num">{num}</div>
                </td>
                <td className="cell-artist">
                  {ev.artistUrl ? (
                    <a href={ev.artistUrl} target="_blank" rel="noopener noreferrer">{ev.artistName}</a>
                  ) : (
                    <span>{ev.artistName}</span>
                  )}
                  <div className="cell-venue">
                    {ev.venueWebsite ? (
                      <a href={ev.venueWebsite} target="_blank" rel="noopener noreferrer">{ev.venueName}</a>
                    ) : ev.venueName}
                    {' · '}
                    {REGION_LABELS[ev.venueRegion] ?? ev.venueRegion}
                  </div>
                </td>
                <td className="cell-genre">{ev.genre ?? ''}</td>
                <td className="cell-tickets">
                  {ev.ticketUrl && (
                    <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer">Buy →</a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
