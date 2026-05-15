// Looks up correct Ticketmaster venue IDs for the 12 venues that
// returned zero events. Run with: node scripts/find-broken-ids.mjs

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

// The 12 venues with bad IDs: [name, expected city, state]
const VENUES = [
  ['UBS Arena', 'Belmont Park', 'NY'],
  ['Bethel Woods', 'Bethel', 'NY'],
  ['The Capitol Theatre', 'Port Chester', 'NY'],
  ['NJPAC', 'Newark', 'NJ'],
  ['MetLife Stadium', 'East Rutherford', 'NJ'],
  ['The Stone Pony', 'Asbury Park', 'NJ'],
  ['Count Basie Center', 'Red Bank', 'NJ'],
  ['College Street Music Hall', 'New Haven', 'CT'],
  ['Mohegan Sun Arena', 'Uncasville', 'CT'],
  ['Toyota Oakdale Theatre', 'Wallingford', 'CT'],
  ['The Met Philadelphia', 'Philadelphia', 'PA'],
  ['Wells Fargo Center', 'Philadelphia', 'PA'],
];

async function findVenue(name, city, state) {
  const url = `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${encodeURIComponent(name)}&stateCode=${state}&apikey=${KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  const matches = json._embedded?.venues || [];

  if (matches.length === 0) {
    return { name, status: 'NOT FOUND' };
  }

  // Try to match on city
  const cityMatch = matches.find(v =>
    v.city?.name?.toLowerCase() === city.toLowerCase()
  );

  const best = cityMatch || matches[0];
  return {
    name,
    matched: best.name,
    city: best.city?.name,
    id: best.id,
    note: cityMatch ? '' : '(no city match - first result returned)',
  };
}

console.log('Looking up venue IDs...\n');

for (const [name, city, state] of VENUES) {
  const result = await findVenue(name, city, state);
  if (result.status === 'NOT FOUND') {
    console.log(`❌ ${name} — NOT FOUND in ${state}`);
  } else {
    const idMarker = result.note ? '⚠️ ' : '✅ ';
    console.log(`${idMarker}${name}`);
    console.log(`   → ${result.matched} (${result.city})`);
    console.log(`   ID: ${result.id} ${result.note}`);
    console.log('');
  }
  // Tiny delay to be polite to the API
  await new Promise(r => setTimeout(r, 200));
}
