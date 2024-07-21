import useSWR from 'swr';
import { UserResponse } from '../types/user';

type Email = string | null | undefined;

const useUser = (email: Email) => {
  const { data, error, isLoading, mutate, isValidating } = useSWR<UserResponse>(
    email ? ['/api/user', email] : null,
    ([url]) => fetch(url).then((res) => res.json()),
  );

  return { user: data, error, isLoading, mutate, isValidating };
};

export default useUser;
