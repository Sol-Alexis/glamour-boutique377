import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* 1. Added 'pt-20' (padding-top) to push content below the fixed header.
        2. Added 'w-full overflow-x-hidden' to prevent horizontal scroll issues during resize.
      */}
      <main className="flex-1 pt-20 w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;