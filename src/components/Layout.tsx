import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Moon, Sun, Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(18, 15, 30, 0)", "rgba(18, 15, 30, 0.95)"]);
  const headerBackdrop = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
  const headerPadding = useTransform(scrollY, [0, 100], ["1.75rem", "0.875rem"]);
  const headerBorder = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.12)"]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 hero-glow opacity-50 dark:opacity-100 transition-opacity duration-500 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent blur-3xl" />
      </div>
      
      <motion.header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 w-full backdrop-saturate-150"
        style={{ 
          backgroundColor: headerBg,
          backdropFilter: headerBackdrop,
          padding: headerPadding,
          borderBottom: `1px solid ${headerBorder}`,
          scale: headerScale,
        }}
      >
        <nav className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Sparkles className="text-accent" size={24} />
              </motion.div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
                Imagify
              </span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
            <NavLink to="/generate" currentPath={location.pathname}>Create</NavLink>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/20 md:hidden z-40"
          >
            <div className="container mx-auto py-4 px-4 flex flex-col space-y-4">
              <MobileNavLink to="/" currentPath={location.pathname} onClick={() => setIsMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/generate" currentPath={location.pathname} onClick={() => setIsMenuOpen(false)}>
                Create
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="container mx-auto py-8 px-4 sm:px-6 pt-28"
      >
        {children}
      </motion.main>
      
      <footer className="container mx-auto py-8 mt-12 border-t border-border/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-accent"
            >
              <Sparkles size={18} />
            </motion.div>
            <span className="font-semibold">Imagify</span>
          </div>
          
          <motion.div 
            className="flex flex-col items-center md:items-end gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">
              Made With <span className="animate-pulse">♥️</span> By{" "}
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500"
              >
                NZ R
              </motion.span>
            </p>
            <p className="text-xs text-muted-foreground/80">
              API Made By{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="font-medium text-accent"
              >
                Rishad
              </motion.span>{" "}
              <span className="animate-pulse">♥️</span>
            </p>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  currentPath: string;
  children: React.ReactNode;
  onClick?: () => void;
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
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, currentPath, children, onClick }) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={cn(
        "relative py-2 px-4 font-medium transition-colors rounded-lg",
        isActive ? "bg-accent/20 text-accent" : "hover:bg-accent/10"
      )}
    >
      {children}
    </Link>
  );
};

export default Layout;
