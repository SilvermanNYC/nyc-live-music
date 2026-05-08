import { getAllEvents } from '../lib/sources/aggregate';
import EventsTable from '../components/EventsTable';
import { VENUES } from '../data/venues';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const REGION_LABELS: Record<string, string> = {
  NYC: 'New York City',
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

  const indieVenues = VENUES.filter(v => v.ticketmasterId === null);
  const indieByRegion: Record<string, typeof indieVenues> = {};
  for (const v of indieVenues) {
    if (!indieByRegion[v.region]) indieByRegion[v.region] = [];
    indieByRegion[v.region].push(v);
  }

  return (
    <>
      <header className="masthead">
        <div className="masthead-left">
          <h1 className="masthead-title">
            <a href="/" className="masthead-link">
              AFTERHOURS<span className="accent-dot">.</span>
            </a>
          </h1>
          <div className="masthead-tagline">
            Live shows across the NYC region
          </div>
        </div>
        <div className="show-count">
          <div className="show-count-num">{events.length}</div>
          <div className="show-count-label">Shows</div>
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

      <section id="indie-venues" className="indie-section">
        <div className="indie-header">
          <h2 className="indie-title">
            Indie Venues<span className="accent-dot">.</span>
          </h2>
          <p className="indie-blurb">
            These venues book direct — schedules don&apos;t flow through ticket aggregators.
            Visit each site for the latest listings.
          </p>
        </div>

        {Object.entries(indieByRegion).map(([region, venues]) => (
          <div key={region} className="indie-region">
            <h3 className="indie-region-title">{REGION_LABELS[region] || region}</h3>
            <div className="indie-grid">
              {venues.map(v => (
                <a
                  key={v.name}
                  href={v.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="indie-card"
                >
                  <div className="indie-name">{v.name}</div>
                  <div className="indie-city">{v.city}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="footer">
        <span>Sources: Ticketmaster Discovery API · Spotify · Direct venue sites</span>
        <span>Built with Next.js · Deployed on Vercel</span>
      </footer>
    </>
  );
}
