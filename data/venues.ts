// Venue list with VERIFIED Ticketmaster IDs (audited April 2026).
// Each ID was confirmed against the live Ticketmaster API by name + city match.
//
// To find a Ticketmaster venue ID for a NEW venue:
// 1. Search the venue at ticketmaster.com
// 2. Click into it; the URL contains /venue/{id}
// 3. OR run scripts/find-venue-ids.mjs after adding it to that script's list
//
// For venues NOT on Ticketmaster, set ticketmasterId to null and provide
// a `scraper` value matching a file in lib/scrapers/.

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
  { name: 'Madison Square Garden', website: 'https://www.msg.com', ticketmasterId: 'KovZpZA7AAEA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Radio City Music Hall', website: 'https://www.msg.com/radio-city-music-hall', ticketmasterId: 'KovZpZAE7vdA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Beacon Theatre', website: 'https://www.msg.com/beacon-theatre', ticketmasterId: 'KovZpZAEAd6A', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Carnegie Hall', website: 'https://www.carnegiehall.org', ticketmasterId: 'KovZpZA1dnJA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Apollo Theater', website: 'https://www.apollotheater.org', ticketmasterId: 'KovZpZA7AAIA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Town Hall', website: 'https://thetownhall.org', ticketmasterId: 'KovZpZAFdJtA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Kings Theatre', website: 'https://www.kingstheatre.com', ticketmasterId: 'KovZpZAJEa6A', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Forest Hills Stadium', website: 'https://www.foresthillsstadium.com', ticketmasterId: 'KovZpZA777nA', scraper: null, city: 'Queens', region: 'NYC' },

  // ===== NYC: Mid-size (Live Nation / AEG, on Ticketmaster) =====
  { name: 'Irving Plaza', website: 'https://www.irvingplaza.com', ticketmasterId: 'KovZpaFPje', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Webster Hall', website: 'https://www.websterhall.com', ticketmasterId: 'KovZpa6WFe', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Terminal 5', website: 'https://www.terminal5nyc.com', ticketmasterId: 'KovZpZAFkn6A', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Brooklyn Steel', website: 'https://www.bkstl.com', ticketmasterId: 'KovZ917AC-V', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Brooklyn Bowl', website: 'https://www.brooklynbowl.com/brooklyn', ticketmasterId: 'KovZpZAIetFA', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Music Hall of Williamsburg', website: 'https://www.musichallofwilliamsburg.com', ticketmasterId: 'KovZpZA77eIA', scraper: null, city: 'Brooklyn', region: 'NYC' },
  { name: 'Bowery Ballroom', website: 'https://www.boweryballroom.com', ticketmasterId: 'KovZpZA7dkJA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Mercury Lounge', website: 'https://www.mercuryloungenyc.com', ticketmasterId: 'KovZpZAJAkAA', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Sony Hall', website: 'https://sonyhall.com', ticketmasterId: 'KovZ917Ah5Q', scraper: null, city: 'New York', region: 'NYC' },
  { name: 'Racket NYC', website: 'https://racketnyc.com', ticketmasterId: null, scraper: 'racket', city: 'New York', region: 'NYC' },
  { name: 'Knockdown Center', website: 'https://knockdown.center', ticketmasterId: null, scraper: 'knockdownCenter', city: 'Queens', region: 'NYC' },

  // ===== NYC: Indie / DICE-ticketed =====
  { name: 'Baby\'s All Right', website: 'https://babysallright.com', ticketmasterId: null, scraper: 'babysAllRight', city: 'Brooklyn', region: 'NYC' },
  { name: 'Elsewhere', website: 'https://www.elsewherebrooklyn.com', ticketmasterId: null, scraper: 'elsewhere', city: 'Brooklyn', region: 'NYC' },
  { name: 'Union Pool', website: 'https://union-pool.com', ticketmasterId: null, scraper: 'unionPool', city: 'Brooklyn', region: 'NYC' },
  { name: 'Pianos', website: 'https://pianosnyc.com', ticketmasterId: null, scraper: 'pianos', city: 'New York', region: 'NYC' },
  { name: 'Rockwood Music Hall', website: 'https://rockwoodmusichall.com', ticketmasterId: null, scraper: 'rockwood', city: 'New York', region: 'NYC' },
  { name: '(Le) Poisson Rouge', website: 'https://lpr.com', ticketmasterId: null, scraper: 'poissonRouge', city: 'New York', region: 'NYC' },
  { name: 'The Bowery Electric', website: 'https://theboweryelectric.com', ticketmasterId: null, scraper: 'boweryElectric', city: 'New York', region: 'NYC' },
  { name: 'City Winery NYC', website: 'https://citywinery.com/new-york', ticketmasterId: null, scraper: 'cityWineryNYC', city: 'New York', region: 'NYC' },

  // ===== NYC: Jazz =====
  { name: 'Blue Note', website: 'https://www.bluenotejazz.com/nyc', ticketmasterId: null, scraper: 'blueNote', city: 'New York', region: 'NYC' },
  { name: 'Village Vanguard', website: 'https://villagevanguard.com', ticketmasterId: null, scraper: 'villageVanguard', city: 'New York', region: 'NYC' },
  { name: 'Birdland', website: 'https://www.birdlandjazz.com', ticketmasterId: null, scraper: 'birdland', city: 'New York', region: 'NYC' },
  { name: 'Smalls Jazz Club', website: 'https://www.smallslive.com', ticketmasterId: null, scraper: 'smalls', city: 'New York', region: 'NYC' },
  { name: 'Dizzy\'s Club (Jazz at Lincoln Center)', website: 'https://www.jazz.org/dizzys', ticketmasterId: null, scraper: 'dizzys', city: 'New York', region: 'NYC' },
  { name: 'Smoke Jazz Club', website: 'https://smokejazz.com', ticketmasterId: null, scraper: 'smoke', city: 'New York', region: 'NYC' },
  { name: 'Bar Lunàtico', website: 'https://www.barlunatico.com', ticketmasterId: null, scraper: 'lunatico', city: 'Brooklyn', region: 'NYC' },

  // ===== NJ =====
  { name: 'Prudential Center', website: 'https://www.prucenter.com', ticketmasterId: 'KovZpZAE7vaA', scraper: null, city: 'Newark', region: 'NJ' },
  { name: 'NJPAC', website: 'https://www.njpac.org', ticketmasterId: 'KovZpa6Vxe', scraper: null, city: 'Newark', region: 'NJ' },
  { name: 'MetLife Stadium', website: 'https://www.metlifestadium.com', ticketmasterId: 'KovZpakS7e', scraper: null, city: 'East Rutherford', region: 'NJ' },
  { name: 'The Stone Pony', website: 'https://www.stoneponyonline.com', ticketmasterId: 'KovZpZAdt7AA', scraper: null, city: 'Asbury Park', region: 'NJ' },
  { name: 'Count Basie Center', website: 'https://thebasie.org', ticketmasterId: 'KovZ917A8C7', scraper: null, city: 'Red Bank', region: 'NJ' },

  // ===== Long Island =====
  { name: 'UBS Arena', website: 'https://www.ubsarena.com', ticketmasterId: 'KovZ917APye', scraper: null, city: 'Belmont Park', region: 'LongIsland' },

  // ===== Hudson Valley =====
  { name: 'Bethel Woods', website: 'https://www.bethelwoodscenter.org', ticketmasterId: 'KovZpZAEAEJA', scraper: null, city: 'Bethel', region: 'HudsonValley' },
  { name: 'The Capitol Theatre', website: 'https://thecapitoltheatre.com', ticketmasterId: 'KovZ917Ax6H', scraper: null, city: 'Port Chester', region: 'HudsonValley' },
  { name: 'Levon Helm Studios', website: 'https://levonhelm.com', ticketmasterId: null, scraper: 'levonHelm', city: 'Woodstock', region: 'HudsonValley' },
  { name: 'Bearsville Theater', website: 'https://www.bearsvilletheater.com', ticketmasterId: null, scraper: 'bearsville', city: 'Bearsville', region: 'HudsonValley' },
  { name: 'Daryl\'s House', website: 'https://www.darylshouseclub.com', ticketmasterId: null, scraper: 'darylsHouse', city: 'Pawling', region: 'HudsonValley' },

  // ===== CT =====
  { name: 'College Street Music Hall', website: 'https://www.collegestreetmusichall.com', ticketmasterId: 'KovZpZA7AlJA', scraper: null, city: 'New Haven', region: 'CT' },
  { name: 'Mohegan Sun Arena', website: 'https://mohegansun.com/entertainment', ticketmasterId: 'KovZpZA6taIA', scraper: null, city: 'Uncasville', region: 'CT' },
  { name: 'Toyota Oakdale Theatre', website: 'https://www.oakdaletheater.com', ticketmasterId: 'KovZpZAEkFtA', scraper: null, city: 'Wallingford', region: 'CT' },

  // ===== MA =====
  { name: 'Tanglewood', website: 'https://www.bso.org/tanglewood', ticketmasterId: null, scraper: 'tanglewood', city: 'Lenox', region: 'MA' },

  // ===== PA =====
  { name: 'The Met Philadelphia', website: 'https://themetphilly.com', ticketmasterId: 'KovZ917Ahxb', scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'Wells Fargo Center', website: 'https://www.wellsfargocenterphilly.com', ticketmasterId: 'Za5ju3rKuqZBbc4XHEVP2-DVEH3jCYZ-l', scraper: null, city: 'Philadelphia', region: 'PA' },
];
