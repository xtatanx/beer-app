import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useUser from '../hooks/useUser';
import Autocomplete from './Autocomplete';
import Image from './Image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './Dropdown';
import { User, LogOut } from 'lucide-react';
import { Button } from './Button';

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
        <DropdownMenu>
          <DropdownMenuTrigger>
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
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-[15rem]" loop align="end">
            <DropdownMenuLabel asChild className="pb-0">
              <p className="truncate">
                {user?.firstName} {user?.lastName}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuLabel
              asChild
              className="pt-0 font-normal text-gray-700"
            >
              <p>{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  router.push('/cuenta');
                }}
              >
                <div className="flex w-full flex-row items-center justify-between gap-3">
                  Mi Perfil
                  <User size={18}></User>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  signOut();
                }}
              >
                <div className="flex w-full flex-row items-center justify-between gap-3">
                  Cerrar sesion
                  <LogOut size={18}></LogOut>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return <Button onClick={() => signIn()}>Iniciar sesion</Button>;
    }
  };

  return (
    <header className="border-b px-4 py-2 md:px-20 lg:flex lg:items-center lg:gap-8">
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
