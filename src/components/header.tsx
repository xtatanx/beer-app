import Link from 'next/link';
import { Button } from './ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const MashLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-primary"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill="currentColor"
    />
    <path
      d="M15 7H9C7.9 7 7 7.9 7 9V15C7 16.1 7.9 17 9 17H15C16.1 17 17 16.1 17 15V9C17 7.9 16.1 7 15 7ZM13 15H11V13H9V11H11V9H13V11H15V13H13V15Z"
      fill="currentColor"
    />
  </svg>
);

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <MashLogo />
          <span className="ml-2 text-2xl font-bold">Mash</span>
        </Link>
        <SignedOut>
          <SignInButton>
            <Button>Acceder</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'size-10',
              },
            }}
          ></UserButton>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
