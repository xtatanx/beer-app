export type BeerResponse = {
  _id: string;
  name: string;
  profileImage: string;
  brewery: Omit<BreweryResponse, '_id'>;
};

export type BreweryResponse = {
  _id: string;
  name: string;
  profileImage: string;
  handler: string;
};

export type AutocompleteResponse = {
  beers: BeerResponse[];
  breweries: BreweryResponse[];
};
