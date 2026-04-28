// Genres the user wants. Ticketmaster categorizes events with `classifications`
// containing segment ("Music"), genre ("Rock"), and subGenre ("Indie Rock").
// We accept an event if EITHER its genre OR subGenre matches the allowlist.
//
// To customize: add or remove strings here. Matching is case-insensitive
// and uses substring matching, so "Rock" will match "Rock", "Alt Rock",
// "Hard Rock", etc. Be careful with broad terms.

export const ALLOWED_GENRES: string[] = [
  // Core / popular
  'Pop',
  'Rock',
  'R&B',
  'Country',
  'Jazz',
  'Blues',

  // Rock subgenres (most are caught by "Rock" substring match,
  // but listing for clarity and to catch any TM oddities)
  'Alternative',
  'Indie',
  'Punk',
  'Hard Rock',
  'Grunge',
  'Progressive',
  'Classic Rock',

  // Global / Regional
  'Reggae',

  // Folk / Roots
  'Folk',
  'Bluegrass',
  'Americana',
  'Gospel',
];

export function matchesAllowedGenre(genre: string | null, subGenre: string | null): boolean {
  const haystack = `${genre ?? ''} ${subGenre ?? ''}`.toLowerCase();
  if (!haystack.trim()) return false;
  return ALLOWED_GENRES.some((g) => haystack.includes(g.toLowerCase()));
}
