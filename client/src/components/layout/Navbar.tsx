import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [location] = useLocation();
  const { toggleCart, totalItems } = useCart();

  useEffect(() => {
    // Check for saved theme preference or respect OS theme
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDarkMode(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "Experiences", href: "/experiences" },
    { name: "Book", href: "/booking" },
    { name: "Membership", href: "/membership" },
    { name: "Merch", href: "/merch" },
    { name: "Franchise", href: "/franchise" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-light/90 dark:bg-dark/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-2 mr-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span className="font-heading font-bold text-xl text-primary">Immersify</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {mainNavLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`font-medium transition-colors ${
                  location === link.href 
                    ? "text-primary" 
                    : "hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/experiences"
              className="hidden md:block"
            >
              <Button className="bg-primary text-white hover:bg-primary/90">
                Admin Panel
              </Button>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Link href="/login" className="hidden md:block">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Sign In
              </Button>
            </Link>
            
            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors ${
                    location === link.href ? "text-primary" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin/experiences"
                onClick={closeMenu}
                className={`py-2 px-4 bg-primary text-white hover:bg-primary/90 rounded-md transition-colors font-medium`}
              >
                Admin Panel
              </Link>
              <Link href="/login" onClick={closeMenu}>
                <Button className="w-full bg-primary hover:bg-primary/90">Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
