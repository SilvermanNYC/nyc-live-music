export type Event = {
  id: string;
  date: string;            // ISO date string
  artistName: string;
  artistUrl: string | null;        // Resolved artist page (Spotify) or fallback
  artistUrlSource: 'spotify' | 'spotify-search' | 'unknown';
  venueName: string;
  venueWebsite: string;
  venueRegion: string;
  ticketUrl: string;
  genre: string | null;
  source: 'ticketmaster' | string;  // scraper name otherwise
};
