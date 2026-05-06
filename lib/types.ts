export type Event = {
  id: string;
  date: string;            // ISO date string
  artistName: string;
  artistUrl: string | null;        // Resolved official website (or fallback)
  artistUrlSource: 'official' | 'spotify' | 'spotify-search' | 'ticketmaster' | 'search' | 'unknown';
  venueName: string;
  venueWebsite: string;
  venueRegion: string;
  ticketUrl: string;
  genre: string | null;
  source: 'ticketmaster' | string;  // scraper name otherwise
};
