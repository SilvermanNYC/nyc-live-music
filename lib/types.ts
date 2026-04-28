export type Event = {
  id: string;
  date: string;            // ISO date string
  artistName: string;
  artistUrl: string | null;        // Spotify artist page URL (or search fallback)
  artistUrlSource: 'spotify' | 'spotify-search' | 'unknown';
  venueName: string;
  venueWebsite: string;
  venueRegion: string;
  ticketUrl: string;
  genre: string | null;
  source: 'ticketmaster' | string;  // scraper name otherwise
};
