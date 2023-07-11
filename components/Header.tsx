import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MdArrowDropDown } from 'react-icons/md';
import useUser from '../hooks/useUser';
import Autocomplete from './Autocomplete';
import Button from './Button';
import DropDown from './DropDown';
import Image from './Image';

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user } = useUser(session?.user?.email);
  const profileImage = user?.profileImage;

  let userInitial = (user?.firstName ?? user?.email)?.charAt(0).toUpperCase();

  const maybeRenderProfile = () => {
    if (status === 'loading') {
      return null;
    }

    if (session) {
      return (
        <DropDown>
          <DropDown.Toggle>
            <div className="flex items-center">
              <div className="relative aspect-square w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
                {profileImage ? (
                  <Image src={profileImage} alt="" width={40} height={40} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gray-200 text-center text-xl font-bold">
                    {userInitial}
                  </span>
                )}
              </div>
              <MdArrowDropDown size={24} />
            </div>
          </DropDown.Toggle>
          <DropDown.Menu>
            <DropDown.MenuItem
              onClick={() => {
                router.push('/cuenta');
              }}
            >
              Mi Perfil
            </DropDown.MenuItem>
            <DropDown.MenuItem
              onClick={() => {
                signOut();
              }}
            >
              Cerrar sesion
            </DropDown.MenuItem>
          </DropDown.Menu>
        </DropDown>
      );
    } else {
      return <Button onClick={() => signIn()}>Iniciar sesion</Button>;
    }
  };

  return (
    <header className="border border-b-neutral-200 bg-neutral-100 px-4 py-2 md:px-20 lg:flex lg:items-center lg:gap-8">
      <div className="hidden lg:block lg:flex-[1_0_140px]">
        <div className="h-10 w-10 rounded-full bg-red-200 "></div>
      </div>
      <div className="mx-auto max-w-xl lg:max-w-none lg:max-w-sm lg:flex-[1_0_auto]">
        <Autocomplete placeholder="Busca por cervezas o cervecerias" />
      </div>
      <div className="items-center justify-end lg:flex lg:flex-[1_0_140px]">
        {maybeRenderProfile()}
      </div>
    </header>
  );
};

export default Header;
