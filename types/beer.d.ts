export type GetAllOptions = {
  sort?: string;
  limit?: string;
  fields?: string | string[];
  filter?: {
    [key: string]: string | number;
  };
};

export type BeerDocument = {
  _id: string;
  name: string;
  breweryId: string;
  profileImage: string;
  srm: number;
  ibus: number;
  abv: number;
  clasification: string;
};

export type BeerResponse = {
  _id: string;
  name: string;
  description: string;
  profileImage: string;
  srm: number;
  ibus: number;
  abv: number;
  clasification: string;
  brewery: {
    _id: string;
    name: string;
  };
  rate: {
    value: number;
    total: number;
  };
  style: {
    _id: string;
    name: string;
  };
};

export type BeerThumbnailProps = {
  id: string;
  breweryId: string;
  name: string;
  profileImage: string;
  abv: number;
  breweryName: string;
  rate: number;
};
