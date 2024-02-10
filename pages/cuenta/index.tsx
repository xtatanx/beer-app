import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Image from '../../components/Image';
import { ChangeEvent, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { unstable_serialize } from 'swr';
import useUser from '../../hooks/useUser';
import { getUser } from '../../lib/userService';
import { authOptions } from '../api/auth/[...nextauth]';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Textarea } from '@/components/TextArea';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/Form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// TODO: unify Provider type
type Provider = {
  callback: string;
  id: string;
  name: string;
  stringUrl: string;
  type: string;
};

type AccountProps = {
  providers: { [key: string]: Provider };
};

const errors = {
  required: 'Este campo es obligatorio',
  maxChar: 'Maximo 150 caracteres',
};

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: errors.required })
    .max(150, { message: 'El campo excede el limite de caracteres' }),
  lastName: z
    .string()
    .min(1, { message: errors.required })
    .max(150, { message: 'El campo excede el limite de caracteres' }),
  bio: z
    .string()
    .max(500, { message: 'La biografia excede el limite de caracteres' }),
  email: z
    .string()
    .min(1, { message: errors.required })
    .max(254, { message: 'El correo excede el limite de caracteres' })
    .email({ message: 'Correo electronico invalido' }),
});

const Account = ({ providers }: AccountProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const { user, mutate } = useUser(session?.user?.email);
  const hasBaseData = user?.profileImage && user?.firstName && user?.lastName;
  const hasGoogleLinked = user?.linkedAccounts?.includes?.(providers.google.id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      bio: user?.bio ?? '',
      email: user?.email ?? '',
    },
  });
  const { control, formState, handleSubmit } = form;

  const handleGoogleClick = () => {
    if (hasGoogleLinked) {
      return;
    } else {
      signIn(providers.google.id, { callbackUrl: '/cuenta' });
    }
  };

  const onUpdateProfile = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch('/api/user', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(values),
    });

    if (response.ok) {
      mutate();
    }
  };

  const handlePicBtn = () => {
    inputFileRef.current?.click();
  };

  const handlePicChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const image = event.target.files[0];
      const body = new FormData();
      body.append('file', image);
      const response = await fetch('/api/user/profile-pic', {
        method: 'POST',
        body,
      });

      if (response.ok) {
        mutate();
      }
    }
  };

  return (
    <section className="mx-auto mb-6 max-w-xl pt-8 lg:mb-12">
      <h1 className="mb-4 text-2xl font-bold">Mi perfil</h1>
      <article className="p-4">
        {hasBaseData ? (
          <div className="mb-8">
            <div className="relative mb-2 aspect-square w-20 overflow-hidden rounded-full bg-gray-200">
              <Image
                alt=""
                src={user.profileImage}
                width={80}
                height={80}
              ></Image>
            </div>
            <div>
              <h2 className="text-lg font-bold capitalize">
                {user.firstName} {user.lastName}
              </h2>
              <button
                className="cursor-pointer text-sm font-bold text-primary hover:text-primary/90"
                onClick={handlePicBtn}
              >
                Cambiar foto de perfil
              </button>
              <input
                ref={inputFileRef}
                className="hidden"
                id="profilePic"
                name="profilePic"
                type="file"
                accept="image/*"
                onChange={handlePicChange}
              />
            </div>
          </div>
        ) : null}
        <Form {...form}>
          <form
            className="mb-12 flex flex-col items-start gap-5"
            onSubmit={handleSubmit(onUpdateProfile)}
          >
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Nombres <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Apellidos <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tu apellido"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Biografía</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuentanos algo de ti"
                      {...field}
                    ></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="text"
                      placeholder="Tu email"
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="ml-auto">
              <Button
                disabled={
                  !(formState.isDirty && formState.isValid) ||
                  formState.isSubmitting
                }
                type="submit"
              >
                {formState.isSubmitting ? 'Guardando' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
        {providers ? (
          <div>
            <h2 className="mb-4 text-lg font-bold">Cuentas asociadas</h2>
            {providers?.google ? (
              <button
                onClick={handleGoogleClick}
                className="flex h-11 w-full items-center justify-center gap-2 rounded border border-gray-400 px-8 font-bold hover:bg-gray-200 disabled:border-gray-200 disabled:bg-transparent disabled:text-gray-300"
                disabled={hasGoogleLinked}
              >
                <FcGoogle size={24}></FcGoogle>
                {hasGoogleLinked ? 'Asociada con' : 'Asociar'}{' '}
                {providers.google.name}
              </button>
            ) : null}
          </div>
        ) : null}
      </article>
    </section>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const providersPromise = getProviders();
  const session = await getServerSession(context.req, context.res, authOptions);

  const user = JSON.parse(
    JSON.stringify(await getUser(session?.user?.email as string)),
  );

  return {
    props: {
      session,
      fallback: {
        [unstable_serialize(['/api/user', session?.user?.email])]: user,
      },
      providers: await providersPromise,
    },
  };
};

export default Account;
