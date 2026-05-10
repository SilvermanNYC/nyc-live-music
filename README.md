# NYC Live Music — Next 6 Months

A web app that aggregates live music events at ~40 venues within ~2 hours of NYC, filtered to your preferred genres, with hot links to venue sites, official artist sites, and ticket purchase pages.

## Architecture

- **Next.js 14 (App Router)** — UI + serverless API routes
- **Ticketmaster Discovery API** — primary event data source (covers Live Nation/AEG venues)
- **Custom scrapers** — for venues not on Ticketmaster (jazz clubs, indie venues)
- **Spotify API + Google Custom Search** — to resolve artist names to official websites
- **File-based JSON cache** — for artist URL lookups (avoids re-querying Google)
- **Vercel cron** — refreshes data daily

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get your API keys

You'll need three keys. All free.

**a) Ticketmaster Discovery API**
- Go to https://developer-acct.ticketmaster.com/user/register
- Create an account, create an app, copy the **Consumer Key**
- Free tier: 5,000 calls/day, 5 calls/sec — plenty for our use

**b) Spotify API (for artist URL lookup, optional but recommended)**
- Go to https://developer.spotify.com/dashboard
- Create an app, copy **Client ID** and **Client Secret**
- We use the Client Credentials flow (no user login)

**c) Google Custom Search API (for official artist site fallback)**
- Get an API key: https://developers.google.com/custom-search/v1/introduction (click "Get a Key")
- Create a search engine: https://programmablesearchengine.google.com/
  - When creating, choose "Search the entire web"
  - Copy the **Search Engine ID** (called `cx`)
- Free tier: 100 queries/day. Our cache means after initial run, you'll mostly only query for new artists.

### 3. Set environment variables

Create `.env.local` in the project root:

```
TICKETMASTER_API_KEY=your_consumer_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GOOGLE_CSE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_search_engine_id
```

### 4. Run locally

```bash
npm run dev
```

Visit http://localhost:3000

First load will be slow (5-30 seconds) because it's hitting Ticketmaster for every venue and looking up artist URLs. Subsequent loads use the file cache and are fast.

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Then in the Vercel dashboard, add the same environment variables under Settings → Environment Variables.

## Customizing

### Adding/removing venues

Edit `data/venues.ts`. Each venue has:
- `name` — display name
- `website` — official venue site (gets hot-linked in the table)
- `ticketmasterId` — Ticketmaster venue ID, or `null` if not on TM
- `scraper` — name of scraper module in `lib/scrapers/`, or `null` if Ticketmaster-only
- `city`, `region` — for grouping

To find a Ticketmaster venue ID: search at https://www.ticketmaster.com, click the venue, and the URL contains the ID (e.g., `KovZpZAFnIEA` for MSG).

### Adjusting genres

Edit the `ALLOWED_GENRES` array in `lib/sources/ticketmaster.ts`.

### Adding a scraper

Drop a new file in `lib/scrapers/` exporting a function `fetchEvents(): Promise<Event[]>`. Then reference its filename in the venue config. See `lib/scrapers/blueNote.ts` for an example.

## Notes & caveats

- **Coverage gaps:** Ticketmaster is comprehensive for Live Nation/AEG venues but won't have indie clubs, most jazz venues, or some standalone halls. Scrapers fill gaps but are fragile — when a venue redesigns its site, the scraper breaks. Plan to maintain.
- **The 6-month window** will look sparse beyond ~3-4 months because most venues haven't announced shows that far out. This is expected.
- **Artist URL resolution** is a best-effort lookup. Spotify's `external_urls` rarely include the artist's homepage, so we fall back to a Google search for `"artist name" official site`. Cached results live in `data/artist-cache.json`. If an artist has no clear official site, we link to their Ticketmaster artist page.

