
import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  
  // Transform values based on scroll position
  const headerBg = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(18, 15, 30, 0)", "rgba(18, 15, 30, 0.8)"]
  );
  
  const headerBackdrop = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(10px)"]
  );
  
  const headerPadding = useTransform(
    scrollY,
    [0, 100],
    ["1.5rem", "1rem"]
  );
  
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 hero-glow -z-10"></div>
      
      <motion.header 
        ref={headerRef} 
        className="fixed top-0 left-0 right-0 z-50 w-full"
        style={{ 
          backgroundColor: headerBg,
          backdropFilter: headerBackdrop,
          padding: headerPadding,
          borderBottom: `1px solid ${headerBorder}`
        }}
      >
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Sparkles className="text-accent" size={24} />
              </motion.div>
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
      </motion.header>
      
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto py-8 px-4 sm:px-6 pt-24"
      >
        {children}
      </motion.main>
      
      <footer className="container mx-auto py-6 mt-12 border-t border-border/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-accent"
            >
              <Sparkles size={16} />
            </motion.div>
            <span className="font-medium">Imagify</span>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground"
          >
            Made With <span className="text-red-500">♥️</span> By <span className="font-medium">NZ R</span>
          </motion.p>
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
