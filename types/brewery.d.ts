export type Options = {
  limit?: number;
};

export type BreweryResponse = {
  _id: string;
  name: string;
  handler: string;
  email: string;
  phone: string;
  description: string;
  country: string;
  city: string;
  profileImage: string;
  userId: string;
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  verified: boolean;
  beersTotal: number;
  commentsTotal: number;
};

export type BreweryThumbnailProps = {
  id: string;
  name: string;
  profileImage: string;
  beers: number;
  rates: number;
  location: string;
  verified: boolean;
};
