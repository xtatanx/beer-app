import { GetServerSidePropsContext } from 'next';
import Image from '../../components/Image';
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from 'react-icons/fa';
import { MdLocationOn, MdVerified } from 'react-icons/md';
import BeerThumbnail from '../../components/BeerThumbnail';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { getAll } from '../../lib/beerService';
import { getById } from '../../lib/breweryService';
import { BeerResponse } from '../../types/beer';
import { BreweryResponse } from '../../types/brewery';
import { NextPageWithLayout } from '../_app';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import Link from 'next/link';

type BreweryDetailQuery = {
  breweryId: string;
};

type BreweryDetailProps = {
  profile: BreweryResponse;
  beers: BeerResponse[];
};

const BreweryDetail: NextPageWithLayout<BreweryDetailProps> = ({
  profile,
  beers,
}) => {
  const {
    social,
    profileImage,
    name,
    verified,
    city,
    country,
    beersTotal,
    commentsTotal,
    description,
    _id,
  } = profile;
  const hasSocialNetworks =
    profile.social.facebook ||
    profile.social.instagram ||
    profile.social.twitter;
  return (
    <article>
      <header className="mb-8">
        <div className="mb-6 flex gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative aspect-square overflow-hidden rounded-full w-32">
              <Image src={profileImage} alt="" fill></Image>
            </div>
            <div>
              <h1 className="flex items-center gap-2 font-bold text-4xl">
                {name}{' '}
                {verified ? (
                  <span className="text-green-500">
                    <MdVerified title="perfil verificado" size={22} />
                  </span>
                ) : null}
              </h1>
              <span className="flex items-center gap-1 text-base">
                {city}, {country}
                <span className="text-gray-400">
                  <MdLocationOn size={18} />
                </span>
              </span>
              {verified ? null : (
                <Button size="sm" className="mt-4" asChild>
                  <Link href={`/cervecerias/reclamar/${_id}`} target="_blank">
                    Reclamar cerveceria
                  </Link>
                </Button>
              )}
            </div>
          </div>
          {hasSocialNetworks ? (
            <div className="flex gap-1 lg:gap-2">
              {social.instagram ? (
                <a href={social.instagram} target="_blank" rel="noreferrer">
                  <FaInstagramSquare size={28} />
                </a>
              ) : null}
              {social.facebook ? (
                <a href={social.facebook} target="_blank" rel="noreferrer">
                  <FaFacebookSquare size={28} />
                </a>
              ) : null}
              {social.twitter ? (
                <a href={social.twitter} target="_blank" rel="noreferrer">
                  <FaTwitterSquare size={28} />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
        <p className="mb-6">{description}</p>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center flex flex-col gap-1">
            <h3 className="font-bold text-lg text-gray-400">Cervezas</h3>
            <p className="font-bold text-3xl">{beersTotal}</p>
          </Card>
          <Card className="p-4 text-center flex flex-col gap-1">
            <h3 className="font-bold text-lg text-gray-400">Opiniones</h3>
            <p className="font-bold text-3xl">{commentsTotal}</p>
          </Card>
        </div>
      </header>
      <section>
        <div className="mb-6 md:mb-12">
          <h2 className="mb-4 text-3xl font-bold md:mb-6">Cervezas</h2>
          <ul className="grid grid-cols-3 gap-4">
            {beers.map((beer) => {
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
      </section>
    </article>
  );
};

BreweryDetail.getLayout = (page) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <main>
        <div className="mx-auto max-w-screen-md py-12">{page}</div>
      </main>
      <Footer></Footer>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<BreweryDetailQuery>,
) => {
  try {
    const { params } = context;

    if (!params) {
      return;
    }

    const breweryProfilePromise = getById(params.breweryId);
    const breweryBeersPromise = getAll({
      filter: {
        breweryId: params.breweryId,
      },
    });

    const breweryProfile = await breweryProfilePromise;
    const breweryBeers = await breweryBeersPromise;

    return {
      props: {
        profile: JSON.parse(JSON.stringify(breweryProfile)),
        beers: JSON.parse(JSON.stringify(breweryBeers)),
      },
    };
  } catch (e) {
    return {
      props: {
        error: e,
      },
    };
  }
};

export default BreweryDetail;
