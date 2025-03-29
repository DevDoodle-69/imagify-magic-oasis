
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 hero-glow -z-10"></div>
      <header className="container mx-auto py-6">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-accent" size={24} />
              <span className="text-2xl font-bold text-gradient">Imagify</span>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-6">
            <NavLink to="/" currentPath={location.pathname}>
              Home
            </NavLink>
            <NavLink to="/generate" currentPath={location.pathname}>
              Create
            </NavLink>
          </div>
        </nav>
      </header>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto py-8 px-4 sm:px-6"
      >
        {children}
      </motion.main>
      <footer className="container mx-auto py-6 mt-12 border-t border-border/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={16} />
            <span className="font-medium">Imagify</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Made With <span className="text-red-500">♥️</span> By <span className="font-medium">NZ R</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  currentPath: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, currentPath, children }) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "relative py-2 px-1 font-medium transition-colors",
        isActive ? "text-accent" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default Layout;
