import type { ReactNode } from 'react';
import Container from './Container';
import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <main>
        <Container>{children}</Container>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
