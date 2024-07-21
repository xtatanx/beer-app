import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Image from '../../components/Image';
import {
  BsStar,
  BsStarFill,
  BsStarHalf,
  BsSuitHeartFill,
} from 'react-icons/bs';
import ReviewBox from '../../components/ReviewBox';
import { getById } from '../../lib/beerService';
import { getAll } from '../../lib/commentService';
import { BeerResponse } from '../../types/beer';
import { CommentResponse } from '../../types/comment';
import useBeerComments from '../../hooks/useBeerComments';
import { Button } from '@/components/Button';

type BeerDetailQuery = {
  beerId: string;
};

type BeerDetailProps = {
  profile: BeerResponse;
  comments: CommentResponse[];
};

const BeerDetail: NextPage<BeerDetailProps> = ({ profile }) => {
  const { _id } = profile;

  const { status } = useSession();
  const { comments } = useBeerComments(_id);

  const handleAddReview = () => {
    if (status === 'unauthenticated') {
      signIn();
      return;
    }

    if (status === 'authenticated') {
      return;
    }
  };

  const {
    name,
    profileImage,
    brewery,
    srm,
    ibus,
    abv,
    rate,
    description,
    style,
  } = profile;

  return (
    <section className="mb-6 grid gap-4 pt-8 md:mb-12 md:auto-cols-min md:grid-flow-col md:grid-cols-12 md:gap-8">
      <article className="md:col-span-4">
        <div className="rounded-lg border p-8 shadow-sm">
          <div className="relative mb-6 aspect-square">
            <Image
              priority
              src={profileImage}
              alt=""
              fill
              className="object-contain"
            />
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-yellow-400 px-2 py-2 text-base font-bold leading-none shadow">
              <BsStarFill></BsStarFill>
              {rate.value.toFixed(1)}
            </span>
            <button className="group absolute right-1 top-1 px-2 py-2  text-lg">
              <BsSuitHeartFill className="text-gray-500 transition ease-in-out group-hover:text-red-600"></BsSuitHeartFill>
            </button>
          </div>
          <h1 className="text-xl font-bold">{name}</h1>
          <span className="mb-4 block font-semibold text-gray-500">
            {brewery.name}
          </span>
          <p className="mb-6 text-base">{description}</p>
          <h2 className="mb-4 text-lg font-bold">
            Estilo: <span className="font-medium">{style.name}</span>
          </h2>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-4 ">
                <span className="text-sm">Palida</span>
                <div className="relative h-2 w-full rounded-md bg-[linear-gradient(90deg,rgba(255,255,69,1)0%,rgba(254,216,73,1)8%,rgba(195,89,0,1)30%,rgba(30,2,4,1)100%)]">
                  <div
                    className="absolute top-1/2 block aspect-square w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-slate-50"
                    style={{
                      left: (srm * 100) / 70 + '%',
                    }}
                  ></div>
                </div>
                <span className="text-sm">Oscura</span>
              </div>
              <p className="grow-1 shrink-0 grow text-center text-sm">
                {srm} SRM(Color)
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4 ">
                <span className="text-sm">Bajo</span>
                <div className="relative h-2 w-full rounded-md bg-gradient-to-r from-[#C7E497] to-[#257318]">
                  <div
                    className="absolute top-1/2 block aspect-square w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-slate-50"
                    style={{
                      left: (ibus * 100) / 100 + '%',
                    }}
                  ></div>
                </div>
                <span className="text-sm">Alto</span>
              </div>
              <p className="grow-1 shrink-0 grow text-center text-sm">
                {ibus} IBU(Amargor)
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4 ">
                <span className="text-sm">Bajo</span>
                <div className="relative h-2 w-full rounded-md bg-gradient-to-r from-[#F9F959] to-[#EE1B2A]">
                  <div
                    className="absolute top-1/2 block aspect-square w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-slate-50"
                    style={{
                      left: (abv * 100) / 20 + '%',
                    }}
                  ></div>
                </div>
                <span className="text-sm">Alto</span>
              </div>
              <p className="grow-1 shrink-0 grow text-center text-sm">
                {abv}% ABV(Alcohol)
              </p>
            </div>
          </div>
        </div>
      </article>
      <aside className="md:col-span-8">
        {status === 'authenticated' ? (
          <div className="mb-4">
            <ReviewBox beerId={_id}></ReviewBox>
          </div>
        ) : null}
        <div className="p-8">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold">
              Opiniones{' '}
              <span className="text-base font-normal text-gray-600">
                ({profile.rate.total} opiniones)
              </span>
            </h2>
            {status === 'unauthenticated' ? (
              <div>
                <Button variant="outline" onClick={handleAddReview}>
                  Agregar reseña
                </Button>
              </div>
            ) : null}
          </div>
          <div>
            {comments
              ? comments.map((comment) => {
                  return (
                    <div
                      key={comment._id}
                      className="border-b border-gray-200 py-6"
                    >
                      <div className="mb-3 flex flex-row items-center gap-2">
                        <div className="relative aspect-square w-14 overflow-hidden rounded-full bg-gray-400">
                          <Image
                            src={comment.user.profileImage}
                            width={56}
                            height={56}
                            alt=""
                          ></Image>
                        </div>
                        <div>
                          <div>
                            <span className="text-base font-bold">
                              {comment.user.firstName} {comment.user.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  includeSeconds: true,
                                  addSuffix: true,
                                  locale: es,
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }, (_, i) => i + 1).map(
                                (value, index, arr) => {
                                  if (comment.value >= value) {
                                    return <BsStarFill key={index} />;
                                  }

                                  if (
                                    comment.value > arr[index - 1] &&
                                    comment.value < value
                                  ) {
                                    return <BsStarHalf key={index} />;
                                  }
                                  return <BsStar key={index} />;
                                },
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p>{comment.comment}</p>
                      {comment.images.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {comment.images.map((imageUrl: string) => {
                            return (
                              <div
                                key={imageUrl}
                                className="relative aspect-square w-20"
                              >
                                <Image src={imageUrl} alt="" fill />
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </aside>
    </section>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<BeerDetailQuery>,
) => {
  try {
    const { params } = context;

    if (!params) {
      return;
    }

    const [beer, comments] = await Promise.all([
      getById({
        id: params.beerId,
      }),
      getAll({
        filter: {
          beerId: params.beerId,
        },
      }),
    ]);

    // TODO: Service should return formatted JSON
    return {
      props: {
        profile: JSON.parse(JSON.stringify(beer)),
        comments: JSON.parse(JSON.stringify(comments)),
        fallback: {
          [`/api/beers/${params.beerId}/comments`]: JSON.parse(
            JSON.stringify(comments),
          ),
        },
      },
    };
  } catch (e) {
    return {
      props: {
        error: e,
      },
    };
  }
};

export default BeerDetail;
