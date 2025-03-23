import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  CreditCard,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-2 mr-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="font-heading font-bold text-xl">Immersify</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Immersify creates extraordinary worlds that exist at the intersection of technology, art, and imagination.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-gray-300 hover:text-white transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-white transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-gray-300 hover:text-white transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/merch" className="text-gray-300 hover:text-white transition-colors">
                  Merchandise
                </Link>
              </li>
              <li>
                <Link href="/franchise" className="text-gray-300 hover:text-white transition-colors">
                  Franchise
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="mt-1 mr-3 text-primary" size={18} />
                <span className="text-gray-300">contact@immersify.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3 text-primary" size={18} />
                <span className="text-gray-300">1-888-IMMERSE</span>
              </li>
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary" size={18} />
                <span className="text-gray-300">HQ: 285 W Broadway, New York, NY 10013</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-3">Sign up for updates</h4>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none bg-gray-800 border-gray-700 focus:ring-primary"
                />
                <Button type="submit" className="rounded-l-none bg-primary hover:bg-primary/90 px-3">
                  <Mail size={18} />
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Immersify, Inc. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#payment" className="text-gray-400 hover:text-gray-300 transition-colors" aria-label="Visa">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.48 9.818L13.62 14.2H12.04L11.12 10.62C11.07 10.42 10.99 10.35 10.77 10.27C10.42 10.14 9.83 10 9.32 10L9.37 9.818H11.73C12 9.818 12.17 9.963 12.22 10.23L12.75 12.77L13.82 9.818H15.48ZM16.3 14.2H14.77L15.77 9.818H17.3L16.3 14.2ZM8.9 12.45L10.5 10.13L10.83 11.13C10.96 11.52 11.08 11.85 11.17 12.14C10.91 12.85 10.17 13.5 8.9 12.45ZM19.52 9.818L17.14 14.182L16.88 14.2H15.42C15.05 14.27 14.77 14.22 14.92 13.84L16.81 9.818H19.52Z" fill="currentColor" />
              </svg>
            </a>
            <a href="#payment" className="text-gray-400 hover:text-gray-300 transition-colors" aria-label="Mastercard">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.87 12C11.87 11 11.22 10.14 10.28 9.77C9.33 9.39 8.28 9.67 7.64 10.4C7 11.13 6.9 12.18 7.36 13.03C7.82 13.88 8.76 14.35 9.76 14.14C10.76 13.93 11.5 13.09 11.5 12.12C11.5 12.08 11.5 12.04 11.5 12H11.87Z" fill="currentColor" />
                <path d="M12.13 12C12.13 13 12.78 13.86 13.72 14.23C14.67 14.61 15.72 14.33 16.36 13.6C17 12.87 17.1 11.82 16.64 10.97C16.18 10.12 15.24 9.65 14.24 9.86C13.24 10.07 12.5 10.91 12.5 11.88C12.5 11.92 12.5 11.96 12.5 12H12.13Z" fill="currentColor" />
              </svg>
            </a>
            <a href="#payment" className="text-gray-400 hover:text-gray-300 transition-colors" aria-label="American Express">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 11.5H14.5V12.5H9.5V11.5ZM20.5 8.5H16.5L15.37 10.37L14.5 8.5H3.5V15.5H14.5L15.37 13.63L16.5 15.5H20.5V8.5ZM4.5 14.5V9.5H13.5L15.5 12L13.5 14.5H4.5ZM16.5 14.5L14.5 12L16.5 9.5H19.5V14.5H16.5Z" fill="currentColor" />
              </svg>
            </a>
            <a href="#payment" className="text-gray-400 hover:text-gray-300 transition-colors" aria-label="Apple Pay">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 14.25C6 16.32 7.6 18 9.75 18C10.65 18 11.37 17.7 11.94 17.31L11.18 16.21C10.77 16.47 10.29 16.71 9.76 16.71C8.48 16.71 7.5 15.68 7.5 14.25C7.5 12.82 8.48 11.79 9.76 11.79C10.3 11.79 10.77 12.03 11.18 12.29L11.94 11.19C11.37 10.8 10.65 10.5 9.75 10.5C7.6 10.5 6 12.18 6 14.25ZM17.75 10.5C15.6 10.5 14 12.18 14 14.25C14 16.32 15.6 18 17.75 18C19.5 18 21 16.8 21 14.25C21 12.18 19.83 10.5 17.75 10.5ZM17.75 16.71C16.47 16.71 15.5 15.68 15.5 14.25C15.5 12.82 16.47 11.79 17.75 11.79C19.03 11.79 20 12.82 20 14.25C20 15.68 19.03 16.71 17.75 16.71ZM14.5 8.25C14.5 6.18 13.32 4.5 11.25 4.5C9.5 4.5 8 5.7 8 7.75C8 9.82 9.17 11.5 11.25 11.5C13.4 11.5 14.5 9.82 14.5 8.25ZM11.25 9.75C10.15 9.75 9.35 9 9.35 7.75C9.35 6.5 10.15 5.75 11.25 5.75C12.35 5.75 13.15 6.5 13.15 7.75C13.15 9 12.35 9.75 11.25 9.75Z" fill="currentColor" />
              </svg>
            </a>
            <a href="#payment" className="text-gray-400 hover:text-gray-300 transition-colors" aria-label="PayPal">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 15.5C9.22 15.5 9 15.73 9 16C9 16.27 9.22 16.5 9.5 16.5H10C10.28 16.5 10.5 16.27 10.5 16C10.5 15.73 10.28 15.5 10 15.5H9.5ZM8 16C8 15.17 8.67 14.5 9.5 14.5H10C10.83 14.5 11.5 15.17 11.5 16C11.5 16.83 10.83 17.5 10 17.5H9.5C8.67 17.5 8 16.83 8 16ZM6.67 14.5H7.5V17.5H6.5V15C6.5 14.73 6.55 14.58 6.67 14.5ZM12.5 14.5H13.4L14.06 16.65H14.1L14.75 14.5H15.5L14.5 17.5H13.69L12.5 14.5ZM11 6.5C11 5.12 12.12 4 13.5 4H17.5C17.78 4 18 4.22 18 4.5C18 4.78 17.78 5 17.5 5H13.5C12.67 5 12 5.67 12 6.5V7H14.5C15.88 7 17 8.12 17 9.5C17 10.88 15.88 12 14.5 12H11C10.72 12 10.5 11.78 10.5 11.5V6.5ZM12 8V11H14.5C15.33 11 16 10.33 16 9.5C16 8.67 15.33 8 14.5 8H12ZM6.5 6.5C6.5 5.12 7.62 4 9 4H10C10.28 4 10.5 4.22 10.5 4.5C10.5 4.78 10.28 5 10 5H9C8.17 5 7.5 5.67 7.5 6.5V11.5C7.5 11.78 7.28 12 7 12C6.72 12 6.5 11.78 6.5 11.5V6.5Z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
