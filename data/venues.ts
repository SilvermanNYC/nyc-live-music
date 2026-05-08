// Venue list. Edit freely.
// To find a Ticketmaster venue ID: search the venue at ticketmaster.com,
// click into it, the URL will contain something like "/venue/KovZpZAFnIEA".
// That alphanumeric string is the ID.
//
// Venues with `ticketmasterId` are pulled from the Ticketmaster Discovery API.
// Venues with `ticketmasterId: null` appear in the "Indie Venues" section
// at the bottom of the page — direct links to their booking pages.
//
// We don't run scrapers anymore — most venues with custom calendars use
// JS-rendered pages that need a headless browser to scrape, which isn't
// worth the complexity. Indie venues are linked directly instead.

export type Venue = {
  name: string;
  website: string;
  ticketmasterId: string | null;
  scraper: string | null;
  city: string;
  region: 'NYC' | 'NJ' | 'LongIsland' | 'HudsonValley' | 'CT' | 'MA' | 'PA';
};

export const VENUES: Venue[] = [
  // ===== NYC: Major =====
  { name: 'Madison Square Garden', website: 'https://www.msg.com', ticketmasterId: 'KovZpZAFnIEA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Radio City Music Hall', website: 'https://www.msg.com/radio-city-music-hall', ticketmasterId: 'KovZpZAEdntA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Beacon Theatre', website: 'https://www.msg.com/beacon-theatre', ticketmasterId: 'KovZpZAEkn7A', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Carnegie Hall', website: 'https://www.carnegiehall.org', ticketmasterId: 'KovZpZAJ7lFA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Apollo Theater', website: 'https://www.apollotheater.org', ticketmasterId: 'KovZpZAJ6t1A', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Town Hall', website: 'https://thetownhall.org', ticketmasterId: 'KovZpZAJI66A', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Kings Theatre', website: 'https://www.kingstheatre.com', ticketmasterId: 'KovZpZAFlntA', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Forest Hills Stadium', website: 'https://www.foresthillsstadium.com', ticketmasterId: 'KovZpZAEAlvA', scraper: null, city: 'Queens', region: 'NYC' },

  // ===== NYC: Mid-size (Live Nation / AEG, on Ticketmaster) =====
  { name: 'Irving Plaza', website: 'https://www.irvingplaza.com', ticketmasterId: 'KovZpZAJ6vlA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Webster Hall', website: 'https://www.websterhall.com', ticketmasterId: 'KovZpZAFt1eA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Terminal 5', website: 'https://www.terminal5nyc.com', ticketmasterId: 'KovZpZAJevtA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Brooklyn Steel', website: 'https://www.bkstl.com', ticketmasterId: 'KovZpaFkkeA', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Brooklyn Bowl', website: 'https://www.brooklynbowl.com/brooklyn', ticketmasterId: 'KovZpZAFkn7A', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Music Hall of Williamsburg', website: 'https://www.musichallofwilliamsburg.com', ticketmasterId: 'KovZpZAJevAA', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Bowery Ballroom', website: 'https://www.boweryballroom.com', ticketmasterId: 'KovZpZAJ6dlA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Mercury Lounge', website: 'https://www.mercuryloungenyc.com', ticketmasterId: 'KovZpZAJ6vAA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Sony Hall', website: 'https://sonyhall.com', ticketmasterId: 'KovZpZA7AAlA', scraper: null, city: 'New York', region: 'NYC' },

  // ===== NYC: Indie / DICE-ticketed (direct links, not aggregated) =====
  { name: 'Racket NYC', website: 'https://racketnyc.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Knockdown Center', website: 'https://knockdown.center', ticketmasterId: null, scraper: null, city: 'Queens', region: 'NYC' },
  { name: 'Baby\'s All Right', website: 'https://babysallright.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Elsewhere', website: 'https://www.elsewherebrooklyn.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Union Pool', website: 'https://union-pool.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Pianos', website: 'https://pianosnyc.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Rockwood Music Hall', website: 'https://rockwoodmusichall.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: '(Le) Poisson Rouge', website: 'https://lpr.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'The Bowery Electric', website: 'https://theboweryelectric.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'City Winery NYC', website: 'https://citywinery.com/new-york', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },

  // ===== NYC: Jazz (most use direct booking, not Ticketmaster) =====
  { name: 'Blue Note', website: 'https://www.bluenotejazz.com/nyc', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Village Vanguard', website: 'https://villagevanguard.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Birdland', website: 'https://www.birdlandjazz.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Smalls Jazz Club', website: 'https://www.smallslive.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Dizzy\'s Club (Jazz at Lincoln Center)', website: 'https://www.jazz.org/dizzys', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Smoke Jazz Club', website: 'https://smokejazz.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Bar Lunàtico', website: 'https://www.barlunatico.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NYC' },

  // ===== NJ =====
  { name: 'Prudential Center', website: 'https://www.prucenter.com', ticketmasterId: 'KovZpZA7AAEA', scraper: null, city: 'Newark', region: 'NJ' },
  { name: 'NJPAC', website: 'https://www.njpac.org', ticketmasterId: 'KovZpZAJaknA', scraper: null, city: 'Newark', region: 'NJ' },
  { name: 'MetLife Stadium', website: 'https://www.metlifestadium.com', ticketmasterId: 'KovZpZA1nlAA', scraper: null, city: 'East Rutherford', region: 'NJ' },
  { name: 'The Stone Pony', website: 'https://www.stoneponyonline.com', ticketmasterId: 'KovZpZAFEnEA', scraper: null, city: 'Asbury Park', region: 'NJ' },
  { name: 'Count Basie Center', website: 'https://thebasie.org', ticketmasterId: 'KovZpZAJ716A', scraper: null, city: 'Red Bank', region: 'NJ' },

  // ===== Long Island =====
  { name: 'UBS Arena', website: 'https://www.ubsarena.com', ticketmasterId: 'KovZ917AVuV', scraper: null, city: 'Belmont Park', region: 'LongIsland' },

  // ===== Hudson Valley =====
  { name: 'Bethel Woods', website: 'https://www.bethelwoodscenter.org', ticketmasterId: 'KovZpZAFlEEA', scraper: null, city: 'Bethel', region: 'HudsonValley' },
  { name: 'The Capitol Theatre', website: 'https://thecapitoltheatre.com', ticketmasterId: 'KovZpZA7knJA', scraper: null, city: 'Port Chester', region: 'HudsonValley' },
  { name: 'Levon Helm Studios', website: 'https://levonhelm.com', ticketmasterId: null, scraper: null, city: 'Woodstock', region: 'HudsonValley' },
  { name: 'Bearsville Theater', website: 'https://www.bearsvilletheater.com', ticketmasterId: null, scraper: null, city: 'Bearsville', region: 'HudsonValley' },
  { name: 'Daryl\'s House', website: 'https://www.darylshouseclub.com', ticketmasterId: null, scraper: null, city: 'Pawling', region: 'HudsonValley' },

  // ===== CT =====
  { name: 'College Street Music Hall', website: 'https://www.collegestreetmusichall.com', ticketmasterId: 'KovZpZAEd7tA', scraper: null, city: 'New Haven', region: 'CT' },
  { name: 'Mohegan Sun Arena', website: 'https://mohegansun.com/entertainment', ticketmasterId: 'KovZpZAFt7lA', scraper: null, city: 'Uncasville', region: 'CT' },
  { name: 'Toyota Oakdale Theatre', website: 'https://www.oakdaletheater.com', ticketmasterId: 'KovZpZAdaJ7A', scraper: null, city: 'Wallingford', region: 'CT' },

  // ===== MA =====
  { name: 'Tanglewood', website: 'https://www.bso.org/tanglewood', ticketmasterId: null, scraper: null, city: 'Lenox', region: 'MA' },

  // ===== PA =====
  { name: 'The Met Philadelphia', website: 'https://themetphilly.com', ticketmasterId: 'KovZpZAJk7tA', scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'Wells Fargo Center', website: 'https://www.wellsfargocenterphilly.com', ticketmasterId: 'KovZpZA7AAvA', scraper: null, city: 'Philadelphia', region: 'PA' },
];
