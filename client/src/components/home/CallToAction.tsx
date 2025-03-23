import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden shadow-xl relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 w-32 h-32 rounded-full bg-white/20"></div>
            <div className="absolute right-20 bottom-10 w-24 h-24 rounded-full bg-white/20"></div>
            <div className="absolute right-1/3 top-1/4 w-16 h-16 rounded-full bg-white/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12 px-8 md:p-16 relative z-10">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Book your first immersive experience today and discover a world where imagination comes to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors">
                    Book Now
                  </Button>
                </Link>
                <Link href="/membership">
                  <Button 
                    variant="outline"
                    className="px-6 py-3 bg-white/20 text-white backdrop-blur-sm border border-white/30 font-medium rounded-md hover:bg-white/30 transition-colors"
                  >
                    Explore Membership
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="font-heading font-semibold text-xl text-white mb-6">What Our Guests Say</h3>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 text-yellow-400" 
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-white/90 text-sm">5.0</span>
                  </div>
                  <blockquote className="text-white/90 italic">
                    "Immersify completely blew my mind! The Digital Forest experience made me feel like I was in another dimension. Can't wait to go back!"
                  </blockquote>
                  <div className="mt-3 text-white/80 text-sm">
                    — Sarah K., New York
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <div className="text-white/90">
                    <span className="block font-bold text-xl">4.9/5</span>
                    <span className="text-sm">Based on 1,200+ reviews</span>
                  </div>
                  <svg viewBox="0 0 24 24" className="h-8 opacity-90" fill="#FFFFFF">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-9v-1.5h9V16zm0-3h-9v-1.5h9V13zm0-3h-9V8.5h9V10z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
