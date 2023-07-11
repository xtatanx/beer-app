import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { NextPageWithLayout } from '../_app';
import { FcGoogle } from 'react-icons/fc';
import Button from '../../components/Button';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

type SignInErrorTypes =
  | 'Signin'
  | 'OAuthSignin'
  | 'OAuthCallback'
  | 'OAuthCreateAccount'
  | 'EmailCreateAccount'
  | 'Callback'
  | 'OAuthAccountNotLinked'
  | 'EmailSignin'
  | 'CredentialsSignin'
  | 'SessionRequired'
  | 'default';

type Provider = {
  callback: string;
  id: string;
  name: string;
  stringUrl: string;
  type: string;
};

type SignInProps = {
  providers: Provider[];
  csrfToken: string;
  error: SignInErrorTypes;
};

const SignIn: NextPageWithLayout<SignInProps> = ({
  providers,
  csrfToken,
  error: errorType,
}) => {
  const errors: Record<SignInErrorTypes, string> = {
    Signin: 'Trata ingresando con una cuenta distinta.',
    OAuthSignin: 'Trata ingresando con una cuenta distinta.',
    OAuthCallback: 'Trata ingresando con una cuenta distinta.',
    OAuthCreateAccount: 'Trata ingresando con una cuenta distinta.',
    EmailCreateAccount: 'Trata ingresando con una cuenta distinta.',
    Callback: 'Trata ingresando con una cuenta distinta.',
    OAuthAccountNotLinked:
      'Para unificar tu cuenta trata iniciando sesion con la cuenta que te registraste inicialmente.',
    EmailSignin: 'El email no se pudo enviar.',
    CredentialsSignin:
      'El registro fallo. Asegurate que los datos que ingresaste son correctos.',
    SessionRequired: 'Porfavor inicia sesion para acceder a esta pagina.',
    default: 'No se pudo completar el ingreso.',
  };

  const callbackUrl = useRouter().query?.callbackUrl as string;

  const error = errorType && (errors[errorType] ?? errors.default);
  return (
    <div className="grid min-h-screen items-center justify-center ">
      <div className="max-w-md p-4">
        <h1 className="mb-10 text-4xl font-bold">
          Descubre las mejores cervezas de Colombia
        </h1>
        {error && (
          <div className="mb-4 rounded bg-red-500 py-4 px-4 text-white">
            <p>{error}</p>
          </div>
        )}
        {Object.values(providers).map((provider) => {
          if (provider.name === 'Email') {
            return (
              <div key={provider.name}>
                <form method="post" action="/api/auth/signin/email">
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ingresa tu correo electronico"
                    className="mb-4 w-full rounded-md bg-gray-200 px-4 py-3 text-gray-800"
                  />
                  <div className="flex flex-col">
                    <Button type="submit" size="lg">
                      Ingresar con Email
                    </Button>
                  </div>
                </form>
                <div className="flex items-center gap-4 py-8">
                  <hr className="flex-grow" />
                  O tambien puedes:
                  <hr className="flex-grow" />
                </div>
              </div>
            );
          }

          if (provider.name === 'Google') {
            return (
              <button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl })}
                className="flex w-full items-center justify-center gap-2 rounded border border-gray-400 py-3 px-8 text-lg font-bold hover:bg-gray-200"
              >
                <FcGoogle size={24}></FcGoogle>
                Ingresar con {provider.name}
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

SignIn.getLayout = (page) => {
  return <>{page}</>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const providersPromise = getProviders();
  const crsfTokenPromise = getCsrfToken(context);
  const { query } = context;

  const providers = await providersPromise;
  const csrfToken = await crsfTokenPromise;

  return {
    props: {
      providers,
      csrfToken,
      error: query?.error ?? null,
    },
  };
};

export default SignIn;
