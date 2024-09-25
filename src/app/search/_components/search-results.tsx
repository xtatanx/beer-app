'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BeerCard from './beer-card';
import BreweryCard from './brewery-card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ComponentProps } from 'react';

interface SearchResultsProps {
  beerResults: ComponentProps<typeof BeerCard>[];
  breweryResults: ComponentProps<typeof BreweryCard>[];
}

const SearchResults = ({ beerResults, breweryResults }: SearchResultsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`${pathname}?${params}`);
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', value);
    router.push(`${pathname}?${params}`);
  };

  return (
    <section className="w-full py-6 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <Tabs
          className="w-full"
          value={searchParams.get('type') || 'beers'}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 md:w-1/2 md:mx-auto">
            <TabsTrigger value="beers">Cervezas</TabsTrigger>
            <TabsTrigger value="breweries">Cervecerías</TabsTrigger>
          </TabsList>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tighter">
              Resultados de Búsqueda
            </h2>
            <Select
              onValueChange={handleSortChange}
              value={searchParams.get('sort') || 'name'}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
                <SelectItem value="abv">ABV (Alcohol)</SelectItem>
                <SelectItem value="ibu">IBU (Amargor)</SelectItem>
                <SelectItem value="style">Estilo</SelectItem>
                <SelectItem value="brewery">Cervecería</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsContent value="beers">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {beerResults.map((beer) => (
                <BeerCard key={beer.id} {...beer} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="breweries">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {breweryResults.map((brewery) => (
                <BreweryCard key={brewery.id} {...brewery} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SearchResults;
