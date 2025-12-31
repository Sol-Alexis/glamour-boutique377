import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { isUserAdmin } from '@/config/admins';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user } = useAuth();
  
  // Single source of truth for admin status
  const isAdmin = isUserAdmin(user?.email);
  return (
    <div className="min-h-screen flex flex-col m-0 p-0"> {/* Ensure zeroed out */}
      <Header isAdmin={isAdmin} />
      {/* Removed pt-20 and overflow-x-hidden from here */}
      <main className="flex-1 w-full"> 
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;