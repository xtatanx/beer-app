import { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '../_app';

type VerifyRequestProps = {
  url: {
    origin: string;
    host: string;
  };
};

const VerifyRequest: NextPageWithLayout<VerifyRequestProps> = ({ url }) => {
  return (
    <div className="grid min-h-screen items-center justify-center ">
      <div className="max-w-md rounded p-4">
        <h1 className="mb-4 text-center text-3xl font-bold">
          Revisa tu correo
        </h1>
        <p>Hemos enviado un link para que puedas ingresar a tu cuenta.</p>
        <p>
          <a className="font-bold" href={url.origin}>
            {url.host}
          </a>
        </p>
      </div>
    </div>
  );
};

VerifyRequest.getLayout = (page) => {
  return <>{page}</>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;
  const url = new URL(req.headers.referer as string);

  return {
    props: {
      url: {
        origin: url.origin,
        host: url.host,
      },
    },
  };
};

export default VerifyRequest;
