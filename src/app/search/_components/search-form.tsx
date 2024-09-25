'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, FormEvent, ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SearchForm = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('q') || ''
  );

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('q', searchTerm);
    router.push(`${pathname}?${params}`);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 max-w-2xl mx-auto">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8 pr-4"
          placeholder="Buscar cervezas o cervecerías..."
          type="search"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit">Buscar</Button>
    </form>
  );
};

export default SearchForm;
