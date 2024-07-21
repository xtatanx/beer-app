import useSWR from 'swr';
import { CommentResponse } from '../types/comment';

const useBeerComments = (beerId: string) => {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    CommentResponse[]
  >(beerId ? `/api/beers/${beerId}/comments` : null, (url: string) =>
    fetch(url).then((res) => res.json()),
  );

  return { comments: data, error, isLoading, mutate, isValidating };
};

export default useBeerComments;
