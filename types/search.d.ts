import type { BreweryResponse } from './brewery';
import type { BeerResponse } from './beer';

export type SearchResponse = BeerResponse[] | BreweryResponse[];
