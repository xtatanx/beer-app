'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Beer,
  Star,
  Hop,
  Droplet,
  Heart,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e, index) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const halfWidth = rect.width / 2;
    const isHalf = x <= halfWidth;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (index, isHalf) => {
    if (readOnly) return;
    onRatingChange(index + (isHalf ? 0.5 : 1));
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const fillPercentage =
      Math.min(Math.max((hoverRating || rating) - index, 0), 1) * 100;

    return (
      <div
        key={index}
        className={`relative w-5 h-5 ${readOnly ? '' : 'cursor-pointer'}`}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const halfWidth = rect.width / 2;
          const isHalf = x <= halfWidth;
          handleClick(index, isHalf);
        }}
      >
        <Star className="w-5 h-5 absolute text-gray-300" />
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
      </div>
    );
  };

  return <div className="flex">{[0, 1, 2, 3, 4].map(renderStar)}</div>;
};

const ImageGallery = ({ images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-[80vh] aspect-square">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-2 transform -translate-y-1/2"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};

const AutoResizingTextarea = React.forwardRef(
  ({ value, onChange, ...props }, ref) => {
    const textareaRef = useRef(null);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value]);

    return (
      <Textarea
        ref={(node) => {
          textareaRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        value={value}
        onChange={(e) => {
          onChange(e);
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        {...props}
      />
    );
  }
);

AutoResizingTextarea.displayName = 'AutoResizingTextarea';

const checkInSchema = z.object({
  rating: z.number().min(0.5).max(5),
  comment: z
    .string()
    .max(255, 'El comentario no puede exceder los 255 caracteres'),
  images: z.array(z.instanceof(File)).optional(),
});

const BeerDetail = ({ beer, checkIns }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [initialGalleryIndex, setInitialGalleryIndex] = useState(0);

  const form = useForm({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      images: [],
    },
  });

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const openGallery = (images, initialIndex) => {
    setGalleryImages(images);
    setInitialGalleryIndex(initialIndex);
    setGalleryOpen(true);
  };

  const onSubmit = (data) => {
    console.log('Check-in submitted:', data);
    form.reset();
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-96 bg-white p-8 overflow-y-auto">
          <div className="sticky top-8 space-y-8">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={beer.imageUrl}
                alt={beer.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{beer.name}</h1>
              <p className="text-lg text-muted-foreground">{beer.style}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                <span>{beer.abv}% Alcohol</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hop className="w-5 h-5 text-green-500" />
                <span>{beer.ibu} IBU</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: beer.color }}
                ></div>
                <span>{beer.colorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>
                  {beer.rating.toFixed(1)} ({beer.ratingCount})
                </span>
              </div>
            </div>
            <p className="text-muted-foreground">{beer.description}</p>
            <div className="flex flex-col space-y-4">
              <SignedIn>
                <Button onClick={toggleFollow} variant={'outline'}>
                  {isFollowing ? (
                    <>
                      <Heart
                        className="mr-2 h-4 w-4 fill-red-500"
                        strokeWidth={0}
                      />{' '}
                      Siguiendo
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" /> Seguir
                    </>
                  )}
                </Button>
              </SignedIn>
              <SignedOut>
                <SignInButton
                  mode="modal"
                  forceRedirectUrl={`/beer/${beer.id}`}
                >
                  <Button onClick={toggleFollow} variant={'outline'}>
                    <Heart className="mr-2 h-4 w-4" /> Seguir
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>Hacer check-in</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Hacer check-in</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Check-in de {beer.name}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calificación</FormLabel>
                              <FormControl>
                                <StarRating
                                  rating={field.value}
                                  onRatingChange={(value) =>
                                    field.onChange(value)
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value.toFixed(1)} estrellas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Comentario</FormLabel>
                              <FormControl>
                                <AutoResizingTextarea
                                  placeholder="¿Qué te pareció esta cerveza?"
                                  className={`resize-none min-h-[100px] ${
                                    field.value.length > 255
                                      ? 'border-red-500 focus:border-red-500'
                                      : ''
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription
                                className={
                                  field.value.length > 255 ? 'text-red-500' : ''
                                }
                              >
                                {field.value.length}/255 caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Imágenes</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    field.onChange(files);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Enviar check-in
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </SignedIn>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Registros recientes</h2>
          <div className="space-y-8">
            {checkIns.map((checkIn, index) => (
              <Card key={checkIn.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={checkIn.user.avatarUrl}
                        alt={checkIn.user.name}
                      />
                      <AvatarFallback>
                        {checkIn.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {checkIn.user.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {checkIn.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={checkIn.rating} readOnly={true} />
                        <span className="text-sm font-medium">
                          {checkIn.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{checkIn.comment}</p>
                      {checkIn.images && checkIn.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {checkIn.images.map((image, imageIndex) => (
                            <button
                              key={imageIndex}
                              className="relative w-20 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={() =>
                                openGallery(checkIn.images, imageIndex)
                              }
                            >
                              <Image
                                src={image}
                                alt={`Foto del registro ${imageIndex + 1}`}
                                fill
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
          <DialogContent className="max-w-[90vw] w-full h-[90vh] p-0">
            <DialogHeader className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGalleryOpen(false)}
                className="rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <ImageGallery
              images={galleryImages}
              initialIndex={initialGalleryIndex}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default function BeerDetailPage() {
  const beer = {
    id: 1,
    name: 'IPA Dorada',
    style: 'India Pale Ale',
    abv: 6.5,
    ibu: 65,
    color: '#FFA500',
    colorName: 'Dorada',
    rating: 4.2,
    ratingCount: 1280,
    description:
      'Una IPA refrescante con notas cítricas y un final amargo equilibrado. Perfecta para los amantes del lúpulo.',
    imageUrl: 'https://placehold.co/400x400/FFA500/FFF/jpeg?text=IPA+Dorada',
  };

  const checkIns = [
    {
      id: 1,
      user: {
        name: 'Carlos Rodríguez',
        avatarUrl: 'https://placehold.co/100x100/4F46E5/FFF/jpeg?text=CR',
      },
      rating: 4.5,
      comment:
        'Excelente IPA, muy refrescante y con un perfil de lúpulo increíble. Definitivamente la volveré a probar.',
      date: 'Hace 2 horas',
      images: [
        'https://placehold.co/800x800/1F2937/FFF/jpeg?text=IPA+1',
        'https://placehold.co/800x800/1F2937/FFF/jpeg?text=IPA+2',
      ],
    },
    {
      id: 2,
      user: {
        name: 'Ana Gómez',
        avatarUrl: 'https://placehold.co/100x100/059669/FFF/jpeg?text=AG',
      },
      rating: 4.0,
      comment:
        'Muy buena cerveza, aunque un poco fuerte para mi gusto. El sabor es excelente.',
      date: 'Hace 1 día',
      images: ['https://placehold.co/800x800/1F2937/FFF/jpeg?text=IPA+3'],
    },
    {
      id: 3,
      user: {
        name: 'Miguel Ángel',
        avatarUrl: 'https://placehold.co/100x100/DC2626/FFF/jpeg?text=MA',
      },
      rating: 5.0,
      comment:
        '¡La mejor IPA que he probado en mucho tiempo! El balance entre malta y lúpulo es perfecto.',
      date: 'Hace 3 días',
      images: [
        'https://placehold.co/800x800/1F2937/FFF/jpeg?text=IPA+4',
        'https://placehold.co/800x800/1F2937/FFF/jpeg?text=IPA+5',
        'https://placehold.co/800x800/1F2937/FFF/jpeg?text=IPA+6',
      ],
    },
  ];

  return <BeerDetail beer={beer} checkIns={checkIns} />;
}
