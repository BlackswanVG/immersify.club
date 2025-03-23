import { MapPin, Users, Star } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 bg-light dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              What is <span className="text-primary">Immersify</span>?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Immersify is a network of immersive experience venues that transport you to extraordinary worlds through cutting-edge technology, interactive art, and sensory storytelling.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Our venues feature multiple themed rooms and environments designed to stimulate your senses and challenge your perception of reality.
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Available locations USA wide</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Across the country</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">4.9 Stars</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average rating</p>
                </div>
              </div>
            </div>
            
            <a href="/experiences" className="inline-flex items-center font-medium text-primary hover:underline">
              Explore our experiences 
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </a>
          </div>
          
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary rounded-lg opacity-20 animate-pulse delay-700"></div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522878129833-838a904a0e9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Immersive experience room with light installations" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
