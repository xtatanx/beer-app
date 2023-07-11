import cn from 'classnames';
import { useSession } from 'next-auth/react';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BsImage, BsPlusLg, BsStar, BsStarFill } from 'react-icons/bs';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import { IoMdCloseCircle } from 'react-icons/io';
import Image from '../Image';
import useBeerComments from '../../hooks/useBeerComments';
import type { ReviewBoxProps } from './types';
import type { PreviewImage } from './types';

const starsArray = Array.from({ length: 5 }, (_, index) => index + 1);
const limit = 250;

const ReviewBox = ({
  placeholder = 'Escribir una reseña',
  beerId,
}: ReviewBoxProps) => {
  const imagesRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const reviewBtnClicked = useRef(false);
  const { data: session } = useSession();
  const { mutate } = useBeerComments(beerId);
  const { user } = useUser(session?.user?.email);
  const userProfilePic = user?.profileImage ?? '';
  const [isEditing, setIsEditing] = useState(false);
  const [rate, setRate] = useState(0);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [review, setReview] = useState('');

  const reviewStatusClasses = cn('font-bold text-sm', {
    'text-red-500': review.length > limit,
  });

  const isDisabledSubmit = useMemo(() => {
    if (rate < 1 || review.length > limit) {
      return true;
    }

    return false;
  }, [review, rate]);

  const handleReviewBtn = () => {
    setIsEditing(true);
    reviewBtnClicked.current = true;
  };

  const handleAddImageBtn = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: rate,
        comment: review,
        images: previewImages.map((image) => image.src),
        beerId,
      }),
    });

    if (response.ok) {
      mutate();
      setIsEditing(false);
      setRate(0);
      setPreviewImages([]);
      setReview('');
      reviewBtnClicked.current = false;
    }
  };

  const handleAddImage = () => {
    imagesRef.current?.click();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.currentTarget;

    if (!fileInput.files) {
      return;
    }

    const body = new FormData();
    body.append('file', fileInput.files[0]);

    const response = await fetch('/api/media/photo-upload', {
      method: 'POST',
      body,
    });

    if (response.ok) {
      const json = await response.json();
      const previewImage = {
        src: json.image,
        id: `${Date.now()}-${fileInput.files[0].name}`,
      };

      setPreviewImages((oldState) => {
        return [...oldState, previewImage];
      });
    }

    fileInput.value = '';
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.currentTarget.value);
  };

  const handleImageRemoval = (id: string) => {
    setPreviewImages(previewImages.filter((image) => image.id !== id));
  };

  useEffect(() => {
    if (isEditing && reviewBtnClicked.current) {
      textAreaRef?.current?.focus();
      reviewBtnClicked.current = false;
    }
  }, [isEditing, textAreaRef]);

  return (
    <div className="flex items-start gap-4 rounded-l bg-white p-8 shadow-sm">
      <div className="relative aspect-square w-12 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-200">
        {userProfilePic ? (
          <Image
            src={userProfilePic}
            alt=""
            layout="fixed"
            width={48}
            height={48}
          />
        ) : null}
      </div>
      {isEditing ? (
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col divide-y">
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-bold">
                ¿Como calificas esta cerveza?
              </h2>
              <div className="flex gap-1">
                {starsArray.map((star) => (
                  <button
                    key={star}
                    onClick={() => setRate(star)}
                    type="button"
                    className="text-2xl text-yellow-500"
                  >
                    {rate >= star ? (
                      <BsStarFill></BsStarFill>
                    ) : (
                      <BsStar></BsStar>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col py-4">
              <textarea
                ref={textAreaRef}
                className="block h-36 w-full resize-none rounded-md bg-gray-200 px-4 py-3 text-gray-600"
                placeholder={placeholder}
                onChange={handleTextAreaChange}
                value={review}
              ></textarea>
              <span className={reviewStatusClasses}>
                {review.length}/{limit}
              </span>
            </div>
            <div className="py-4">
              <h2 className="mb-2 text-sm font-bold">Agregar una foto</h2>
              <div className="flex flex-wrap gap-2">
                {previewImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square w-24"
                  >
                    <Image
                      src={image.src}
                      alt=""
                      width={96}
                      height={96}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="center"
                    />
                    <button
                      className="absolute right-0 top-0 opacity-0 transition-opacity group-hover:opacity-100"
                      type="button"
                      onClick={() => handleImageRemoval(image.id)}
                    >
                      <IoMdCloseCircle size={24}></IoMdCloseCircle>
                      <span className="sr-only">Remover imagen</span>
                    </button>
                  </div>
                ))}
                <button
                  className="flex aspect-square w-24 items-center justify-center border-2 border-dashed bg-gray-100 text-gray-300"
                  type="button"
                  onClick={handleAddImage}
                >
                  <BsPlusLg size={16}></BsPlusLg>
                </button>
              </div>
              <input
                ref={imagesRef}
                className="hidden"
                id="reviewImages"
                name="reviewImages"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="self-end">
              <Button type="submit" disabled={isDisabledSubmit}>
                Publicar
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <button
            className="-mr-4 h-12 flex-1 rounded-full bg-gray-200 px-4 py-1 text-left transition hover:bg-gray-300"
            onClick={handleReviewBtn}
          >
            {placeholder}
          </button>
          <button
            className="flex aspect-square w-12 items-center justify-center text-gray-300 transition hover:text-gray-400"
            onClick={handleAddImageBtn}
          >
            <BsImage size={28}></BsImage>
          </button>
        </>
      )}
    </div>
  );
};

export default ReviewBox;
