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
    /* ADDED: bg-background, text-foreground, and transition-colors. 
       This ensures the entire screen turns black/charcoal when dark mode is active.
    */
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <Header isAdmin={isAdmin} />
      
      <main className="flex-1 w-full"> 
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;