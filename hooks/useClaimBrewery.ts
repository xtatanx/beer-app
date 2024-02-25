import useSWRMutation from 'swr/mutation';

const claimBrewery = async (
  url: string,
  {
    arg,
  }: { arg: { name: string; email: string; title: string; message: string } },
) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
};

const useClaimBrewery = (breweryId: string) => {
  return useSWRMutation(`/api/forms/claim-brewery/${breweryId}`, claimBrewery);
};

export default useClaimBrewery;
