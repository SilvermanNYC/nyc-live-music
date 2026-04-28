import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8')
  .split('\n')
  .filter(l => l.includes('='))
  .reduce((acc, l) => { const [k, ...v] = l.split('='); acc[k.trim()] = v.join('=').trim(); return acc; }, {});

const KEY = env.TICKETMASTER_API_KEY;
if (!KEY) { console.error('TICKETMASTER_API_KEY not found in .env.local'); process.exit(1); }

const venuesRaw = fs.readFileSync('data/venues.ts', 'utf-8');
const venueLines = venuesRaw.match(/{ name: '[^']+', website:[^}]+}/g) || [];
const venues = venueLines.map(line => {
  const name = line.match(/name: '([^']+)'/)[1];
  const tmId = (line.match(/ticketmasterId: '([^']+)'/) || [])[1] || null;
  return { name, tmId };
}).filter(v => v.tmId);

console.log(`\nAuditing ${venues.length} venues against Ticketmaster API...\n`);

for (const v of venues) {
  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/venues/${v.tmId}.json?apikey=${KEY}`);
    if (res.ok) {
      const data = await res.json();
      const realName = data.name || '?';
      const city = data.city?.name || '?';
      const matchesName = realName.toLowerCase().includes(v.name.toLowerCase().split(' ')[0].toLowerCase());
      const flag = matchesName ? '✓' : '✗ MISMATCH';
      console.log(`${flag}  ${v.name}`);
      console.log(`     config id:   ${v.tmId}`);
      console.log(`     resolves to: ${realName} (${city})`);
    } else {
      console.log(`✗ INVALID  ${v.name}  (id ${v.tmId} → HTTP ${res.status})`);
    }
  } catch (e) {
    console.log(`✗ ERROR    ${v.name}: ${e.message}`);
  }
  await new Promise(r => setTimeout(r, 300));
}

console.log('\nDone.\n');
