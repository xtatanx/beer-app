import { ErrorMessage, Field, Form, Formik } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Image from '../../components/Image';
import { ChangeEvent, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { unstable_serialize } from 'swr';
import * as Yup from 'yup';
import useUser from '../../hooks/useUser';
import { getUser } from '../../lib/userService';
import { authOptions } from '../api/auth/[...nextauth]';
import { Button } from '@/components/Button';

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

interface FormValues {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
}

const errors = {
  required: 'Este campo es obligatorio',
  maxChar: 'Maximo 150 caracteres',
};

const Account = ({ providers }: AccountProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const { user, mutate } = useUser(session?.user?.email);
  const hasBaseData = user?.profileImage && user?.firstName && user?.lastName;
  const hasGoogleLinked = user?.linkedAccounts?.includes?.(providers.google.id);
  const initialValues: FormValues = {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    bio: user?.bio ?? '',
    email: user?.email ?? '',
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required(errors.required),
    lastName: Yup.string().required(errors.required),
    email: Yup.string().required(errors.required),
    bio: Yup.string().max(150, errors.maxChar),
  });

  const handleGoogleClick = () => {
    if (hasGoogleLinked) {
      return;
    } else {
      signIn(providers.google.id, { callbackUrl: '/cuenta' });
    }
  };

  const handleSubmit = async (values: FormValues) => {
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ dirty, isValid, isSubmitting }) => (
            <Form className="mb-12 flex flex-col items-start gap-5">
              <label htmlFor="fistName" className="block w-full">
                <span className="mb-2 block font-bold">Nombres</span>
                <Field
                  className="block w-full rounded-md bg-gray-200 px-4 py-3 text-gray-800"
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  name="firstName"
                />
                <ErrorMessage
                  className="text-xs font-semibold text-red-600"
                  component="span"
                  name="firstName"
                />
              </label>
              <label htmlFor="lastName" className="block w-full">
                <span className="mb-2 block font-bold">Apellidos</span>
                <Field
                  className="block w-full rounded-md bg-gray-200 px-4 py-3 text-gray-800"
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  name="lastName"
                />
                <ErrorMessage
                  className="text-xs font-semibold text-red-600"
                  component="span"
                  name="lastName"
                />
              </label>
              <label htmlFor="bio" className="block w-full">
                <span className="mb-2 block font-bold">Biografía</span>
                <Field
                  className="block h-20 w-full resize-y rounded-md bg-gray-200 px-4 py-3 text-gray-800"
                  id="bio"
                  placeholder="Cuentanos algo de ti"
                  name="bio"
                  as="textarea"
                />
                <ErrorMessage
                  className="text-xs font-semibold text-red-600"
                  component="span"
                  name="bio"
                />
              </label>
              <label htmlFor="email" className="block w-full">
                <span className="mb-2 block font-bold">Email</span>
                <Field
                  disabled
                  className="block w-full rounded-md bg-gray-200 px-4 py-3 text-gray-400"
                  id="email"
                  type="email"
                  placeholder="Tu email"
                  name="email"
                />
                <ErrorMessage
                  className="text-xs font-semibold text-red-600"
                  component="span"
                  name="email"
                />
              </label>
              <div className="ml-auto">
                <Button
                  disabled={!(dirty && isValid) || isSubmitting}
                  type="submit"
                >
                  Guardar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
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
  context: GetServerSidePropsContext
) => {
  const providersPromise = getProviders();
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const user = JSON.parse(
    JSON.stringify(await getUser(session?.user?.email as string))
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
