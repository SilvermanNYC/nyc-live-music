import { getAllEvents } from '../lib/sources/aggregate';
import { VENUES } from '../data/venues';
import EventsTable from '../components/EventsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REGION_LABELS: Record<string, string> = {
  NYC: 'NYC',
  NJ: 'New Jersey',
  LongIsland: 'Long Island',
  HudsonValley: 'Hudson Valley',
  CT: 'Connecticut',
  MA: 'Massachusetts',
  PA: 'Pennsylvania',
};

export default async function HomePage() {
  let events: Awaited<ReturnType<typeof getAllEvents>>['events'] = [];
  let fetchedAt = '';
  let errorMessage: string | null = null;

  try {
    const result = await getAllEvents(false);
    events = result.events;
    fetchedAt = result.fetchedAt;
  } catch (e: any) {
    errorMessage = String(e?.message ?? e);
  }

  const fetchedDate = fetchedAt ? new Date(fetchedAt) : null;

  // Find venues with zero events — these are the "also worth checking" entries
  const venueNamesWithEvents = new Set(events.map((e) => e.venueName));
  const venuesWithoutEvents = VENUES.filter((v) => !venueNamesWithEvents.has(v.name));

  // Group by region for cleaner display
  const venuesByRegion: Record<string, typeof VENUES> = {};
  for (const v of venuesWithoutEvents) {
    if (!venuesByRegion[v.region]) venuesByRegion[v.region] = [];
    venuesByRegion[v.region].push(v);
  }
  const regionOrder: Array<keyof typeof REGION_LABELS> = ['NYC', 'NJ', 'LongIsland', 'HudsonValley', 'CT', 'MA', 'PA'];

  return (
    <>
      <header className="masthead">
        <h1 className="masthead-title">
          Live <em>/</em> NYC
        </h1>
        <div className="masthead-meta">
          <div>Vol. I — No. 1</div>
          <div>Six Months Out</div>
          <div>~2 Hours From Manhattan</div>
        </div>
      </header>

      <div className="dateline">
        <span>Issued {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span>{fetchedDate ? `Data refreshed ${fetchedDate.toLocaleString('en-US')}` : 'Refreshing data…'}</span>
      </div>

      {errorMessage && (
        <div className="error-state">Error fetching events: {errorMessage}</div>
      )}

      <EventsTable events={events} />

      {venuesWithoutEvents.length > 0 && (
        <section className="also-checking">
          <div className="also-checking-header">
            <h2 className="also-checking-title">Indie Venues</h2>
            <p className="also-checking-subtitle">
              Smaller rooms and clubs we can't auto-fetch yet — click through to see what's on their calendar.
            </p>
          </div>
          <div className="also-checking-grid">
            {regionOrder.map((region) => {
              const list = venuesByRegion[region];
              if (!list || list.length === 0) return null;
              return (
                <div key={region} className="also-checking-region">
                  <h3 className="also-checking-region-name">{REGION_LABELS[region] ?? region}</h3>
                  <ul className="also-checking-list">
                    {list.map((v) => (
                      <li key={v.name}>
                        <a href={v.website} target="_blank" rel="noopener noreferrer">
                          {v.name}
                        </a>
                        <span className="also-checking-city">{v.city}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <footer className="footer">
        <span>Sources: Ticketmaster Discovery API · Custom venue scrapers · Spotify</span>
        <span>Built with Next.js · Deployed on Vercel</span>
      </footer>
    </>
  );
}
