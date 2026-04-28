// Looks up the correct Ticketmaster venue IDs by name + city.
// Run with: node scripts/find-venue-ids.mjs

import fs from 'fs';

// Read API key from .env.local
const env = fs.readFileSync('.env.local', 'utf-8')
  .split('\n')
  .filter(l => l.includes('='))
  .reduce((acc, l) => {
    const [k, ...v] = l.split('=');
    acc[k.trim()] = v.join('=').trim();
    return acc;
  }, {});

const KEY = env.TICKETMASTER_API_KEY;
if (!KEY) {
  console.error('TICKETMASTER_API_KEY not found in .env.local');
  process.exit(1);
}

// Venues to look up: [name, expected city, state code]
const VENUES = [
  ['Madison Square Garden', 'New York', 'NY'],
  ['Radio City Music Hall', 'New York', 'NY'],
  ['Beacon Theatre', 'New York', 'NY'],
  ['Carnegie Hall', 'New York', 'NY'],
  ['Apollo Theater', 'New York', 'NY'],
  ['Town Hall', 'New York', 'NY'],
  ['Kings Theatre', 'Brooklyn', 'NY'],
  ['Forest Hills Stadium', 'Forest Hills', 'NY'],
  ['Irving Plaza', 'New York', 'NY'],
  ['Webster Hall', 'New York', 'NY'],
  ['Terminal 5', 'New York', 'NY'],
  ['Brooklyn Steel', 'Brooklyn', 'NY'],
  ['Brooklyn Bowl', 'Brooklyn', 'NY'],
  ['Music Hall of Williamsburg', 'Brooklyn', 'NY'],
  ['Bowery Ballroom', 'New York', 'NY'],
  ['Mercury Lounge', 'New York', 'NY'],
  ['Sony Hall', 'New York', 'NY'],
  ['Prudential Center', 'Newark', 'NJ'],
  ['NJPAC', 'Newark', 'NJ'],
  ['MetLife Stadium', 'East Rutherford', 'NJ'],
  ['Stone Pony', 'Asbury Park', 'NJ'],
  ['Count Basie', 'Red Bank', 'NJ'],
  ['UBS Arena', 'Belmont Park', 'NY'],
  ['Bethel Woods', 'Bethel', 'NY'],
  ['Capitol Theatre', 'Port Chester', 'NY'],
  ['College Street Music Hall', 'New Haven', 'CT'],
  ['Mohegan Sun Arena', 'Uncasville', 'CT'],
  ['Oakdale', 'Wallingford', 'CT'],
  ['Met Philadelphia', 'Philadelphia', 'PA'],
  ['Wells Fargo Center', 'Philadelphia', 'PA'],
];

console.log('\nFinding venue IDs by name + city match...\n');

for (const [name, city, state] of VENUES) {
  const url = `https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${KEY}&keyword=${encodeURIComponent(name)}&stateCode=${state}&countryCode=US&size=20`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      console.log(`?  ${name.padEnd(35)} HTTP ${r.status}`);
      continue;
    }
    const data = await r.json();
    const candidates = data._embedded?.venues || [];

    // Prefer exact city match, then any candidate whose name includes our search
    const match =
      candidates.find(v => v.city?.name?.toLowerCase() === city.toLowerCase()) ||
      candidates.find(v => v.name?.toLowerCase().includes(name.toLowerCase()));

    if (match) {
      console.log(`OK ${name.padEnd(35)} ${match.id.padEnd(20)} (${match.name} / ${match.city?.name})`);
    } else {
      console.log(`?? ${name.padEnd(35)} NOT FOUND  (${candidates.length} candidates, none in ${city})`);
    }
  } catch (e) {
    console.log(`xx ${name.padEnd(35)} ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 350));
}

console.log('\nDone.\n');
