// Resolves artist names to their Spotify artist page URL.
//
// This is much simpler than the previous Google-based approach:
// - Spotify's search API reliably returns artist pages for almost any artist
// - The link is useful — clickable to actually hear the artist's music
// - No flaky aggregator filtering needed
// - Generous rate limits
//
// Fallback if Spotify fails or returns nothing: a Spotify search URL,
// which still opens Spotify and lets the user pick the right artist.

import fs from 'fs/promises';
import path from 'path';

const CACHE_PATH = path.join(process.cwd(), 'data', 'artist-cache.json');

type CacheEntry = {
  url: string | null;
  source: 'spotify' | 'spotify-search' | 'unknown';
  resolvedAt: string;
};

type Cache = Record<string, CacheEntry>;

let cache: Cache | null = null;
let spotifyToken: { token: string; expiresAt: number } | null = null;

async function loadCache(): Promise<Cache> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf-8');
    cache = JSON.parse(raw);
  } catch {
    cache = {};
  }
  return cache!;
}

async function saveCache() {
  if (!cache) return;
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function getSpotifyToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    console.warn('[artistResolver] Spotify credentials missing — falling back to search links only');
    return null;
  }

  if (spotifyToken && spotifyToken.expiresAt > Date.now() + 60_000) {
    return spotifyToken.token;
  }

  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
      console.warn(`[artistResolver] Spotify token fetch failed: HTTP ${res.status}`);
      return null;
    }
    const data = await res.json() as { access_token: string; expires_in: number };
    spotifyToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return spotifyToken.token;
  } catch (e) {
    console.warn('[artistResolver] Spotify token error:', e);
    return null;
  }
}

async function findSpotifyArtistUrl(artist: string, token: string): Promise<string | null> {
  // Spotify's search API. We look for the top artist match and return
  // their Spotify page URL.
  const params = new URLSearchParams({
    q: artist,
    type: 'artist',
    limit: '1',
  });
  const url = `https://api.spotify.com/v1/search?${params}`;

  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json() as {
      artists?: { items?: Array<{ external_urls?: { spotify?: string } }> };
    };
    const top = data.artists?.items?.[0];
    return top?.external_urls?.spotify ?? null;
  } catch {
    return null;
  }
}

function spotifySearchFallback(artist: string): string {
  // If we can't resolve the artist directly, link to Spotify's search page —
  // user can pick the right artist themselves. Still useful, still listenable.
  return `https://open.spotify.com/search/${encodeURIComponent(artist)}`;
}

export async function resolveArtistUrl(artist: string): Promise<{ url: string; source: CacheEntry['source'] }> {
  const c = await loadCache();
  const key = artist.trim().toLowerCase();

  // Check cache. If we have a valid URL, use it.
  if (c[key]?.url) {
    return { url: c[key].url!, source: c[key].source };
  }

  // Try Spotify search
  const token = await getSpotifyToken();
  if (token) {
    const found = await findSpotifyArtistUrl(artist, token);
    if (found) {
      c[key] = { url: found, source: 'spotify', resolvedAt: new Date().toISOString() };
      await saveCache();
      return { url: found, source: 'spotify' };
    }
  }

  // Fallback: Spotify search URL
  const fallback = spotifySearchFallback(artist);
  c[key] = { url: fallback, source: 'spotify-search', resolvedAt: new Date().toISOString() };
  await saveCache();
  return { url: fallback, source: 'spotify-search' };
}

export async function resolveAllArtists(events: { artistName: string }[]): Promise<Map<string, { url: string; source: CacheEntry['source'] }>> {
  const unique = Array.from(new Set(events.map((e) => e.artistName)));
  const result = new Map<string, { url: string; source: CacheEntry['source'] }>();

  // Resolve sequentially with a tiny delay to be polite to Spotify.
  // Their rate limit is generous (well over what we'll hit) but no need to hammer.
  for (const name of unique) {
    try {
      const r = await resolveArtistUrl(name);
      result.set(name, r);
    } catch (e) {
      console.warn(`Artist resolve failed for ${name}:`, e);
      result.set(name, { url: spotifySearchFallback(name), source: 'spotify-search' });
    }
    // 50ms = 20 req/sec, well under Spotify's burst tolerance
    await new Promise((r) => setTimeout(r, 50));
  }
  return result;
}
