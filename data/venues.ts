// Venue list. Edit freely.
// To find a Ticketmaster venue ID: search the venue at ticketmaster.com,
// click into it, the URL will contain something like "/venue/KovZpZAFnIEA".
// That alphanumeric string is the ID.
//
// Venues with `ticketmasterId` are pulled from the Ticketmaster Discovery API.
// Venues with `ticketmasterId: null` appear in the "Indie Venues" section
// at the bottom of the page — direct links to their booking pages.
//
// Coverage: New York state (NYC, Long Island, Hudson Valley), New Jersey,
// and Connecticut. We don't run scrapers anymore — venues with custom
// calendars are linked directly via the Indie Venues section.

export type Venue = {
  name: string;
  website: string;
  ticketmasterId: string | null;
  scraper: string | null;
  city: string;
  region: 'NY' | 'NJ' | 'CT' | 'MA' | 'PA';
};

export const VENUES: Venue[] = [
  // ===== NY: NYC Major =====
  { name: 'Madison Square Garden', website: 'https://www.msg.com', ticketmasterId: 'KovZpZAFnIEA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Radio City Music Hall', website: 'https://www.msg.com/radio-city-music-hall', ticketmasterId: 'KovZpZAEdntA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Beacon Theatre', website: 'https://www.msg.com/beacon-theatre', ticketmasterId: 'KovZpZAEkn7A', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Carnegie Hall', website: 'https://www.carnegiehall.org', ticketmasterId: 'KovZpZAJ7lFA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Apollo Theater', website: 'https://www.apollotheater.org', ticketmasterId: 'KovZpZAJ6t1A', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Town Hall', website: 'https://thetownhall.org', ticketmasterId: 'KovZpZAJI66A', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Kings Theatre', website: 'https://www.kingstheatre.com', ticketmasterId: 'KovZpZAFlntA', scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Forest Hills Stadium', website: 'https://www.foresthillsstadium.com', ticketmasterId: 'KovZpZAEAlvA', scraper: null, city: 'Queens', region: 'NY' },

  // ===== NY: NYC Mid-size (Live Nation / AEG, on Ticketmaster) =====
  { name: 'Irving Plaza', website: 'https://www.irvingplaza.com', ticketmasterId: 'KovZpZAJ6vlA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Webster Hall', website: 'https://www.websterhall.com', ticketmasterId: 'KovZpZAFt1eA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Terminal 5', website: 'https://www.terminal5nyc.com', ticketmasterId: 'KovZpZAJevtA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Brooklyn Steel', website: 'https://www.bkstl.com', ticketmasterId: 'KovZpaFkkeA', scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Brooklyn Bowl', website: 'https://www.brooklynbowl.com/brooklyn', ticketmasterId: 'KovZpZAFkn7A', scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Music Hall of Williamsburg', website: 'https://www.musichallofwilliamsburg.com', ticketmasterId: 'KovZpZAJevAA', scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Bowery Ballroom', website: 'https://www.boweryballroom.com', ticketmasterId: 'KovZpZAJ6dlA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Mercury Lounge', website: 'https://www.mercuryloungenyc.com', ticketmasterId: 'KovZpZAJ6vAA', scraper: null, city: 'New York', region: 'NY' },
  { name: 'Sony Hall', website: 'https://sonyhall.com', ticketmasterId: 'KovZpZA7AAlA', scraper: null, city: 'New York', region: 'NY' },

  // ===== NY: Indie / DICE-ticketed (direct links, not aggregated) =====
  { name: 'Racket NYC', website: 'https://racketnyc.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Knockdown Center', website: 'https://knockdown.center', ticketmasterId: null, scraper: null, city: 'Queens', region: 'NY' },
  { name: 'Baby\'s All Right', website: 'https://babysallright.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Elsewhere', website: 'https://www.elsewherebrooklyn.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Union Pool', website: 'https://union-pool.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NY' },
  { name: 'Pianos', website: 'https://pianosnyc.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Rockwood Music Hall', website: 'https://rockwoodmusichall.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: '(Le) Poisson Rouge', website: 'https://lpr.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'The Bowery Electric', website: 'https://theboweryelectric.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'City Winery NYC', website: 'https://citywinery.com/new-york', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },

  // ===== NY: Jazz =====
  { name: 'Blue Note', website: 'https://www.bluenotejazz.com/nyc', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Village Vanguard', website: 'https://villagevanguard.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Birdland', website: 'https://www.birdlandjazz.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Smalls Jazz Club', website: 'https://www.smallslive.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Dizzy\'s Club (Jazz at Lincoln Center)', website: 'https://www.jazz.org/dizzys', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Smoke Jazz Club', website: 'https://smokejazz.com', ticketmasterId: null, scraper: null, city: 'New York', region: 'NY' },
  { name: 'Bar Lunàtico', website: 'https://www.barlunatico.com', ticketmasterId: null, scraper: null, city: 'Brooklyn', region: 'NY' },

  // ===== NY: Long Island =====
  { name: 'UBS Arena', website: 'https://www.ubsarena.com', ticketmasterId: 'KovZ917APye', scraper: null, city: 'Belmont Park', region: 'NY' },

  // ===== NY: Hudson Valley =====
  { name: 'Bethel Woods', website: 'https://www.bethelwoodscenter.org', ticketmasterId: 'KovZpZAEAEJA', scraper: null, city: 'Bethel', region: 'NY' },
  { name: 'The Capitol Theatre', website: 'https://thecapitoltheatre.com', ticketmasterId: 'KovZ917Ax6H', scraper: null, city: 'Port Chester', region: 'NY' },
  { name: 'Levon Helm Studios', website: 'https://levonhelm.com', ticketmasterId: null, scraper: null, city: 'Woodstock', region: 'NY' },
  { name: 'Bearsville Theater', website: 'https://www.bearsvilletheater.com', ticketmasterId: null, scraper: null, city: 'Bearsville', region: 'NY' },
  { name: 'Daryl\'s House', website: 'https://www.darylshouseclub.com', ticketmasterId: null, scraper: null, city: 'Pawling', region: 'NY' },

  // ===== NJ =====
  { name: 'Prudential Center', website: 'https://www.prucenter.com', ticketmasterId: 'KovZpZA7AAEA', scraper: null, city: 'Newark', region: 'NJ' },
  { name: 'NJPAC', website: 'https://www.njpac.org', ticketmasterId: 'KovZpa6Vxe', scraper: null, city: 'Newark', region: 'NJ' },
  { name: 'MetLife Stadium', website: 'https://www.metlifestadium.com', ticketmasterId: 'KovZpakS7e', scraper: null, city: 'East Rutherford', region: 'NJ' },
  { name: 'The Stone Pony', website: 'https://www.stoneponyonline.com', ticketmasterId: 'KovZpZAdt7AA', scraper: null, city: 'Asbury Park', region: 'NJ' },
  { name: 'Count Basie Center', website: 'https://thebasie.org', ticketmasterId: 'KovZ917A8C7', scraper: null, city: 'Red Bank', region: 'NJ' },

  // ===== CT =====
  { name: 'College Street Music Hall', website: 'https://www.collegestreetmusichall.com', ticketmasterId: 'KovZpZA7AlJA', scraper: null, city: 'New Haven', region: 'CT' },
  { name: 'Mohegan Sun Arena', website: 'https://mohegansun.com/entertainment', ticketmasterId: 'KovZpZA6taIA', scraper: null, city: 'Uncasville', region: 'CT' },
  { name: 'Toyota Oakdale Theatre', website: 'https://www.oakdaletheater.com', ticketmasterId: 'KovZpZAEkFtA', scraper: null, city: 'Wallingford', region: 'CT' },
  { name: 'Premier Theater at Foxwoods', website: 'https://www.foxwoods.com/entertainment', ticketmasterId: 'KovZpZAE6e6A', scraper: null, city: 'Mashantucket', region: 'CT' },

  // ===== CT: Indie / direct booking =====
  { name: 'Ridgefield Playhouse', website: 'https://ridgefieldplayhouse.org', ticketmasterId: null, scraper: null, city: 'Ridgefield', region: 'CT' },
  { name: 'Westville Music Bowl', website: 'https://westvillemusicbowl.com', ticketmasterId: null, scraper: null, city: 'New Haven', region: 'CT' },
  { name: 'Fairfield Theatre Company', website: 'https://fairfieldtheatre.org', ticketmasterId: null, scraper: null, city: 'Fairfield', region: 'CT' },
  { name: 'The Klein', website: 'https://theklein.org', ticketmasterId: null, scraper: null, city: 'Bridgeport', region: 'CT' },
  { name: 'Infinity Music Hall Hartford', website: 'https://www.infinityhall.com', ticketmasterId: null, scraper: null, city: 'Hartford', region: 'CT' },
  { name: 'Infinity Music Hall Norfolk', website: 'https://www.infinityhall.com', ticketmasterId: null, scraper: null, city: 'Norfolk', region: 'CT' },
  { name: 'The Bushnell', website: 'https://bushnell.org', ticketmasterId: null, scraper: null, city: 'Hartford', region: 'CT' },
  { name: 'Webster Theater', website: 'https://webstertheater.com', ticketmasterId: null, scraper: null, city: 'Hartford', region: 'CT' },
  { name: 'Space Ballroom', website: 'https://www.spaceballroom.com', ticketmasterId: null, scraper: null, city: 'Hamden', region: 'CT' },

  // ===== MA =====
  { name: 'TD Garden', website: 'https://www.tdgarden.com', ticketmasterId: 'KovZpa2gne', scraper: null, city: 'Boston', region: 'MA' },
  { name: 'MGM Music Hall at Fenway', website: 'https://www.mgmmusichall.com', ticketmasterId: 'KovZ917AEJz', scraper: null, city: 'Boston', region: 'MA' },
  { name: 'Boch Center Wang Theatre', website: 'https://www.bochcenter.org', ticketmasterId: null, scraper: null, city: 'Boston', region: 'MA' },
  { name: 'Tanglewood', website: 'https://www.bso.org/tanglewood', ticketmasterId: null, scraper: null, city: 'Lenox', region: 'MA' },
  { name: 'Roadrunner', website: 'https://roadrunnerboston.com', ticketmasterId: null, scraper: null, city: 'Boston', region: 'MA' },

  // ===== PA =====
  { name: 'The Met Philadelphia', website: 'https://themetphilly.com', ticketmasterId: 'KovZ917Ahxb', scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'The Fillmore Philadelphia', website: 'https://www.thefillmorephilly.com', ticketmasterId: 'KovZpZAEkteA', scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'Wells Fargo Center', website: 'https://www.wellsfargocenterphilly.com', ticketmasterId: null, scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'Franklin Music Hall', website: 'https://www.franklinmusichall.com', ticketmasterId: null, scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'The Mann Center', website: 'https://www.manncenter.org', ticketmasterId: null, scraper: null, city: 'Philadelphia', region: 'PA' },
  { name: 'Xfinity Live!', website: 'https://www.xfinitylive.com', ticketmasterId: null, scraper: null, city: 'Philadelphia', region: 'PA' },
];
