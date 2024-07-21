import useSWR from 'swr';
import { SearchResponse } from '../types/search';

const useSearch = ([query, type]: [string | null, string | null]) => {
  const { data, error, isLoading, mutate, isValidating } =
    useSWR<SearchResponse>(
      query
        ? `/api/search?${new URLSearchParams({
            term: query,
            ...(type && { type }),
          })}`
        : null,
      (url: string) => fetch(url).then((res) => res.json()),
    );

  return { result: data, error, isLoading, mutate, isValidating };
};

export default useSearch;
