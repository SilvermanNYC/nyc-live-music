// Placeholder scraper for venues that haven't been implemented yet.
// Returns an empty list. The venue will appear in the UI with no events.

import type { Venue } from '../../data/venues';
import type { Event } from '../types';

export default async function stub(_venue: Venue, _monthsAhead: number): Promise<Event[]> {
  return [];
}
