'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, FormEvent, ChangeEvent } from 'react';

const SearchForm = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${search}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <form className="flex space-x-2" onSubmit={handleSubmit}>
      <Input
        className="flex-1"
        placeholder="Buscar una cerveza..."
        onChange={handleChange}
        type="search"
      />
      <Button type="submit" size="icon" variant="secondary">
        <Search className="h-4 w-4" />
        <span className="sr-only">Buscar</span>
      </Button>
    </form>
  );
};

export default SearchForm;
