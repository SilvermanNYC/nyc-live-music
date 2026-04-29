'use client';

import { useMemo, useState } from 'react';
import type { Event } from '../lib/types';

type SortKey = 'date' | 'venueName' | 'artistName' | 'genre';

const REGION_LABELS: Record<string, string> = {
  NYC: 'NYC',
  NJ: 'NJ',
  LongIsland: 'Long Island',
  HudsonValley: 'Hudson Valley',
  CT: 'CT',
  MA: 'MA',
  PA: 'PA',
};

export default function EventsTable({ events }: { events: Event[] }) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string>('all');
  const [venue, setVenue] = useState<string>('all');
  const [genre, setGenre] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(true);

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
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (e) =>
          e.artistName.toLowerCase().includes(q) ||
          e.venueName.toLowerCase().includes(q) ||
          (e.genre ?? '').toLowerCase().includes(q)
      );
    }

    out = [...out].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'date': cmp = a.date.localeCompare(b.date); break;
        case 'venueName': cmp = a.venueName.localeCompare(b.venueName); break;
        case 'artistName': cmp = a.artistName.localeCompare(b.artistName); break;
        case 'genre': cmp = (a.genre ?? '').localeCompare(b.genre ?? ''); break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return out;
  }, [events, region, venue, genre, search, sortKey, sortAsc]);

  function clickSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  return (
    <>
      <div className="controls">
        <div className="control">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Artist, venue, genre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          Indie Venues →
        </a>
        <div className="results-count">
          {filtered.length} {filtered.length === 1 ? 'show' : 'shows'}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">No events found. Check your API keys and venue IDs.</div>
      ) : (
        <table className="listings">
          <thead>
            <tr>
              <th onClick={() => clickSort('date')}>Date {sortIndicator('date', sortKey, sortAsc)}</th>
              <th onClick={() => clickSort('artistName')}>Artist {sortIndicator('artistName', sortKey, sortAsc)}</th>
              <th onClick={() => clickSort('venueName')}>Venue {sortIndicator('venueName', sortKey, sortAsc)}</th>
              <th onClick={() => clickSort('genre')}>Genre {sortIndicator('genre', sortKey, sortAsc)}</th>
              <th>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ev) => (
              <tr key={ev.id}>
                <td className="cell-date">
                  {formatDate(ev.date)}
                </td>
                <td className="cell-artist">
                  {ev.artistUrl ? (
                    <a href={ev.artistUrl} target="_blank" rel="noopener noreferrer">{ev.artistName}</a>
                  ) : (
                    <span>{ev.artistName}</span>
                  )}
                  {ev.artistUrlSource === 'spotify-search' && (
                    <span className="source-tag search" title="Could not resolve a direct artist page — link goes to Spotify search">search</span>
                  )}
                </td>
                <td className="cell-venue">
                  <a href={ev.venueWebsite} target="_blank" rel="noopener noreferrer">{ev.venueName}</a>
                  <span className="region">{REGION_LABELS[ev.venueRegion] ?? ev.venueRegion}</span>
                </td>
                <td className="cell-genre">{ev.genre ?? '—'}</td>
                <td className="cell-tickets">
                  <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer">Buy</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function sortIndicator(col: SortKey, sortKey: SortKey, sortAsc: boolean) {
  if (sortKey !== col) return '';
  return sortAsc ? '↑' : '↓';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const full = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <>
      <span className="day">{day}</span>
      <span className="full">{full}</span>
    </>
  );
}
