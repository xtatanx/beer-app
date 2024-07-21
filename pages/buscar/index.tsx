import Link from 'next/link';
import { useRouter } from 'next/router';
import BeerThumbnail from '../../components/BeerThumbnail';
import BreweryThumbnail from '../../components/BreweryThumbnail';
import useSearch from '../../hooks/useSearch';
import { MdSearch } from 'react-icons/md';
import { BreweryResponse } from '../../types/brewery';
import { Button } from '@/components/Button';

const Search = () => {
  const { query: { q, type = 'cervezas' } = {} } = useRouter();
  const { result: items, isLoading } = useSearch([q as string, type as string]);

  const title = q;
  const isTypeBreweries = type === 'cervecerias';
  const placeholder = Array.from({ length: 8 }, (_, i) => i);

  const renderSubHeadline = () => {
    if (isLoading) {
      return (
        <div className="inline-block h-6 w-1/3 animate-pulse bg-gray-200"></div>
      );
    }

    const searchType = type === 'cervecerias' ? 'cerveceria' : 'cerveza';

    if (items && items?.length > 0) {
      return (
        <p className="text-base">
          <span className="font-bold">{items?.length}</span> {searchType}
          {items?.length > 1 ? 's' : ''} encontradas
        </p>
      );
    }

    return <p className="text-base">Ooops! no encontramos ningun resultado.</p>;
  };

  const maybeRenderResult = () => {
    if (isLoading) {
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 2xl:gap-8">
          {placeholder.map((id) => {
            return (
              <div
                key={id}
                className="shadow-neutral-20 rounded-lg border border-neutral-200 shadow-md"
              >
                <div className="px-2 pb-2 pt-6">
                  <div className="relative mb-4 aspect-square animate-pulse bg-gray-200"></div>
                </div>
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="mb-2 h-4 w-full animate-pulse bg-gray-200"></div>
                    <div className="mb-2 h-4 w-1/4 animate-pulse bg-gray-200"></div>
                  </div>
                  <div className="mb-2 h-4 w-2/4 animate-pulse bg-gray-200"></div>
                  <div className="h-4 w-2/4 animate-pulse bg-gray-200"></div>
                </div>
              </div>
            );
          })}
        </ul>
      );
    }

    if (items && items?.length > 0) {
      return (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 2xl:gap-8">
          {items?.map((item) => {
            let thumbnail;
            if (isTypeBreweries && 'beersTotal' in item) {
              thumbnail = (
                <BreweryThumbnail
                  id={item._id}
                  name={item.name}
                  profileImage={item.profileImage}
                  beers={item.beersTotal}
                  rates={item.commentsTotal}
                  location={`${item.city}, ${item.country}`}
                  verified={item.verified}
                />
              );
            } else if ('abv' in item) {
              thumbnail = (
                <BeerThumbnail
                  id={item._id}
                  name={item.name}
                  profileImage={item.profileImage}
                  abv={item.abv}
                  rate={item.rate.value}
                  breweryId={item.brewery._id}
                  breweryName={item.brewery.name}
                />
              );
            }
            return <li key={item._id}>{thumbnail}</li>;
          })}
        </ul>
      );
    }

    if (items?.length === 0) {
      return (
        <div className="flex flex-col items-center px-4 text-center">
          <div className="mb-4 text-7xl text-gray-300 md:text-9xl">
            <MdSearch></MdSearch>
          </div>
          <h1 className="mb-4 text-2xl font-bold md:text-4xl">
            ¿Por que no intentas buscando de nuevo?
          </h1>
        </div>
      );
    }
  };

  return (
    <section className="mb-6 pt-8 md:mb-12">
      <section className="mb-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-2xl font-bold md:text-5xl">{title}</h1>
          {renderSubHeadline()}
        </div>
        <div className="flex justify-center">
          <div className="flex gap-4">
            <Link
              href={{
                pathname: '/buscar',
                query: {
                  q: q,
                },
              }}
              passHref
              legacyBehavior
            >
              <Button
                variant={!isTypeBreweries ? 'default' : 'secondary'}
                asChild
              >
                <a>Cervezas {}</a>
              </Button>
            </Link>
            <Link
              href={{
                pathname: '/buscar',
                query: {
                  q: q,
                  type: 'cervecerias',
                },
              }}
              passHref
              legacyBehavior
            >
              <Button
                variant={isTypeBreweries ? 'default' : 'secondary'}
                asChild
              >
                <a>Cervecerias</a>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section>{maybeRenderResult()}</section>
    </section>
  );
};

export default Search;
