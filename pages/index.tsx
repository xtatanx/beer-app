import BeerThumbnail from '../components/BeerThumbnail';
import { getAll } from '../lib/beerService';
import { BeerResponse } from '../types/beer';
import type { NextPageWithLayout } from './_app';

type IndexProps = {
  mostVotedBeers: BeerResponse[];
  lastBeers: BeerResponse[];
};

const Home: NextPageWithLayout<IndexProps> = ({
  mostVotedBeers,
  lastBeers,
}) => {
  return (
    <div className="pt-8">
      <div className="mb-6 md:mb-16">
        <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-4xl">
          Cervezas mas populares
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 2xl:gap-8">
          {mostVotedBeers.map((beer) => {
            return (
              <li key={beer._id}>
                <BeerThumbnail
                  id={beer._id}
                  name={beer.name}
                  profileImage={beer.profileImage}
                  abv={beer.abv}
                  rate={beer.rate.value}
                  breweryId={beer.brewery._id}
                  breweryName={beer.brewery.name}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mb-6 md:mb-12">
        <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-4xl">
          Cervezas agregadas recientemente
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 2xl:gap-8">
          {lastBeers.map((beer) => {
            return (
              <li key={beer._id}>
                <BeerThumbnail
                  id={beer._id}
                  name={beer.name}
                  profileImage={beer.profileImage}
                  abv={beer.abv}
                  rate={beer.rate.value}
                  breweryId={beer.brewery._id}
                  breweryName={beer.brewery.name}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  try {
    const mostVotedBeers = await getAll({ limit: '8', sort: 'rate-desc' });
    const lastBeers = await getAll({ limit: '4', sort: 'date-desc' });
    return {
      props: {
        mostVotedBeers: JSON.parse(JSON.stringify(mostVotedBeers)),
        lastBeers: JSON.parse(JSON.stringify(lastBeers)),
      },
    };
  } catch (e) {}
}

export default Home;
