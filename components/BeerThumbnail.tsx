import Link from 'next/link';
import { BsStarFill } from 'react-icons/bs';
import { BeerThumbnailProps } from '../types/beer';
import Image from './Image';

const BeerThumbnail = ({
  id,
  breweryId,
  name,
  profileImage,
  abv,
  breweryName,
  rate,
}: BeerThumbnailProps) => {
  return (
    <article className="shadow-neutral-20 rounded-lg border border-neutral-200 bg-white shadow-md">
      <Link href={`/cervezas/${id}`}>
        <a>
          <div className="px-2 pb-2 pt-6">
            <div className="relative aspect-square">
              <Image
                src={profileImage}
                alt={name}
                className="mb-4"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </a>
      </Link>
      <div className="p-4">
        <div className="flex gap-1">
          <h2 className="flex-1 truncate text-base font-bold">
            <Link href={`/cervezas/${id}`}>{name}</Link>
          </h2>
          <span className="flex items-center gap-1 text-base">
            <BsStarFill />
            {rate?.toFixed(1)}
          </span>
        </div>
        <div className="grid">
          <h3 className="truncate text-base underline">
            <Link href={`/cervecerias/${breweryId}`}>{breweryName}</Link>
          </h3>
        </div>
        <span className="text-sm">ABV {abv?.toFixed(1)}%</span>
      </div>
    </article>
  );
};

export default BeerThumbnail;
