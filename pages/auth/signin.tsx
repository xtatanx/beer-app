import { getProviders, signIn } from 'next-auth/react';
import { NextPageWithLayout } from '../_app';
import { FcGoogle } from 'react-icons/fc';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/Form';

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

const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Correo electronico invalido' })
    .max(254, { message: 'El correo exede el limite de caracteres' }),
});

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

const SignIn: NextPageWithLayout<SignInProps> = ({
  providers,
  error: errorType,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const callbackUrl = useRouter().query?.callbackUrl as string;
  const onSubmitEmail = async ({ email }: z.infer<typeof formSchema>) => {
    await signIn('email', { email, callbackUrl });
  };

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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitEmail)}
                    className="flex flex-col"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Ingresa tu correo electronico"
                              className="h-12"
                              {...field}
                            ></Input>
                          </FormControl>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    ></FormField>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? 'Enviando'
                        : 'Ingresar con Email'}
                    </Button>
                  </form>
                </Form>
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded border border-gray-400 px-8 text-lg font-bold hover:bg-gray-200"
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
  context: GetServerSidePropsContext,
) => {
  const providersPromise = getProviders();
  const { query } = context;

  const providers = await providersPromise;

  return {
    props: {
      providers,
      error: query?.error ?? null,
    },
  };
};

export default SignIn;
