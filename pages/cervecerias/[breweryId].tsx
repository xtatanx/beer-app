import { GetServerSidePropsContext } from 'next';
import Image from '../../components/Image';
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from 'react-icons/fa';
import { MdLocationOn, MdVerified } from 'react-icons/md';
import BeerThumbnail from '../../components/BeerThumbnail';
import Container from '../../components/Container';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { getAll } from '../../lib/beerService';
import { getById } from '../../lib/breweryService';
import { BeerResponse } from '../../types/beer';
import { BreweryResponse } from '../../types/brewery';
import { NextPageWithLayout } from '../_app';

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
  const hasSocialNetworks =
    profile.social.facebook ||
    profile.social.instagram ||
    profile.social.twitter;
  return (
    <article>
      <header className="relative mb-10 border-b pb-8 lg:mb-16 lg:pb-8">
        <div
          className="absolute left-0 top-0 h-52 w-full bg-gray-500 lg:h-72
        "
        ></div>
        <Container>
          <div className="items-end lg:flex lg:gap-4">
            <div className="mb-4 flex flex-col items-center pt-4 lg:mb-0 lg:shrink-0 lg:pt-24">
              <div className="relative aspect-square w-56 overflow-hidden rounded-full border-4 border-white lg:border-8">
                <Image
                  src={profile.profileImage}
                  alt=""
                  objectFit="cover"
                  layout="fill"
                ></Image>
              </div>
              <h1 className="flex items-center gap-2 text-xl font-bold">
                {profile.name}{' '}
                <span className="text-green-500">
                  <MdVerified title="perfil verificado" size={22} />
                </span>
              </h1>
              <span className="flex items-center gap-1 text-base text-gray-500">
                {profile.city}{' '}
                <span className="text-gray-400">
                  <MdLocationOn size={18} />
                </span>
              </span>
            </div>
            <div className="flex items-center justify-around lg:grow lg:py-3">
              <p>{profile.beersTotal} Cervezas</p>
              <p>{profile.commentsTotal} Opiniones</p>
              {hasSocialNetworks ? (
                <div className="flex gap-1 lg:gap-2">
                  {profile.social.instagram ? (
                    <a
                      href={profile.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaInstagramSquare size={28} />
                    </a>
                  ) : null}
                  {profile.social.facebook ? (
                    <a
                      href={profile.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaFacebookSquare size={28} />
                    </a>
                  ) : null}
                  {profile.social.twitter ? (
                    <a
                      href={profile.social.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaTwitterSquare size={28} />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </header>
      <Container>
        <section>
          <div className="mb-6 md:mb-12">
            <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-4xl">
              Cervezas
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 2xl:gap-8">
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
      </Container>
    </article>
  );
};

BreweryDetail.getLayout = (page) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <main>{page}</main>
      <Footer></Footer>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<BreweryDetailQuery>
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
