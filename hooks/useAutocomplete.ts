import useSWR from 'swr';
import { AutocompleteResponse } from '../types/autocomplete';

const useAutocomplete = (query: string | null) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<AutocompleteResponse>(
      query
        ? `/api/autocomplete?${new URLSearchParams({ term: query })}`
        : null,
      (url: string) => fetch(url).then((res) => res.json()),
      {
        keepPreviousData: true,
      }
    );

  return { result: data, error, isLoading, mutate, isValidating };
};

export default useAutocomplete;
