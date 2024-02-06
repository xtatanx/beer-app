import Link from 'next/link';
import { MdVerified } from 'react-icons/md';
import type { BreweryThumbnailProps } from '../../types/brewery';
import Image from '../Image';

const BreweryThumbnail = ({
  id,
  name,
  profileImage,
  beers,
  rates,
  location,
  verified,
}: BreweryThumbnailProps) => {
  return (
    <article className="rounded-lg border shadow-sm">
      <Link href={`/cervecerias/${id}`}>
        <div className="px-2 pb-2 pt-6">
          <div className="relative aspect-square">
            <Image src={profileImage} alt={name} className="mb-4" fill />
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-1">
            <h2 className="flex w-full items-center text-base font-bold lg:gap-2">
              <span className="truncate">{name}</span>
              {verified ? (
                <span className="text-green-500">
                  <MdVerified title="perfil verificado" size={18} />
                </span>
              ) : null}
            </h2>
          </div>
          <div className="mb-2 space-x-2 text-base">
            <span>
              {beers} Cerveza{beers < 2 ? null : 's'}
            </span>
            <span>•</span>
            <span>
              {rates} Opinion{rates < 2 ? null : 'es'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">{location}</div>
        </div>
      </Link>
    </article>
  );
};

export default BreweryThumbnail;
