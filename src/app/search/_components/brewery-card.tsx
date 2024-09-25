'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Beer, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BreweryCardProps {
  id: number;
  name: string;
  location: string;
  established: number;
  rating: number;
  imageUrl: string;
  beerCount: number;
}

const BreweryCard = ({
  id,
  name,
  location,
  established,
  rating,
  imageUrl,
  beerCount,
}: BreweryCardProps) => (
  <Link href={`/brewery/${id}`} passHref>
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold truncate">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>{rating}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Establecida en {established}
            </span>
            <div className="flex items-center space-x-1">
              <Beer className="w-4 h-4" />
              <span>{beerCount} cervezas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default BreweryCard;
