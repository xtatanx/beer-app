'use client';

import { useState, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Beer, Hop, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BeerCardProps {
  id: number;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  rating: number;
  imageUrl: string;
}

const BeerCard = ({
  id,
  name,
  brewery,
  style,
  abv,
  ibu,
  rating,
  imageUrl,
}: BeerCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you would typically also send a request to your backend to update the user's favorites
  };

  return (
    <Link href={`/beer/${id}`} passHref>
      <Card className="w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 ${
              isFavorite ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={toggleFavorite}
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? 'currentColor' : 'none'}
            />
            <span className="sr-only">Toggle favorite</span>
          </Button>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold truncate">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <p className="font-medium text-muted-foreground">{brewery}</p>
              <p className="text-muted-foreground">{style}</p>
            </div>
            <div className="flex justify-between items-center w-full text-sm">
              <div className="flex items-center space-x-1">
                <Beer className="w-4 h-4" />
                <span>{abv}% ABV</span>
              </div>
              <div className="flex items-center space-x-1">
                <Hop className="w-4 h-4" />
                <span>{ibu} IBU</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BeerCard;
