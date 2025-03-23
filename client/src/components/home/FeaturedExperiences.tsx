import { useState, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Experience card component
const ExperienceCard = ({ experience }) => {
  return (
    <div className="experience-card min-w-[300px] md:min-w-[400px] snap-start rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex-shrink-0 transform transition-transform hover:scale-[1.02] cursor-pointer">
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img 
          src={experience.imageUrl} 
          alt={experience.name} 
          className="w-full h-full object-cover"
        />
        {experience.isPopular && (
          <div className="absolute top-3 right-3 bg-primary/90 text-white text-sm px-3 py-1 rounded-full">
            Popular
          </div>
        )}
        {experience.isNew && (
          <div className="absolute top-3 right-3 bg-secondary/90 text-white text-sm px-3 py-1 rounded-full">
            New
          </div>
        )}
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity flex items-end">
          <div className="p-4 text-white">
            <p className="text-sm font-medium">{experience.shortDescription}</p>
            <Link href={`/experience/${experience.slug}`}>
              <Button 
                className="mt-3 px-4 py-1.5 bg-white text-primary font-medium rounded-md text-sm hover:bg-gray-100 transition-colors"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-xl mb-2">{experience.name}</h3>
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
          <span className="font-medium">4.9</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">(412 reviews)</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {experience.duration} min experience • {experience.minAge === 0 ? 'All ages' : `Ages ${experience.minAge}+`} • {experience.specialEquipment || 'No special equipment'}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${experience.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">/ person</span></span>
          <Link href="/booking">
            <Button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedExperiences = () => {
  const carouselRef = useRef(null);
  
  // Fetch experiences
  const { data: experiences = [], isLoading, error } = useQuery({
    queryKey: ['/api/experiences'],
    select: (data) => data || [],
  });

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section id="experiences" className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Featured Experiences
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Each Immersify experience is uniquely designed to transport you to another world. Here are some of our most popular adventures.
          </p>
        </div>
        
        <div className="relative">
          {/* Carousel Controls */}
          <Button 
            onClick={scrollLeft}
            variant="secondary" 
            size="icon" 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-dark/80 rounded-full shadow-md hover:bg-white hover:dark:bg-gray-800 -ml-4 md:ml-0"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </Button>
          
          <Button 
            onClick={scrollRight}
            variant="secondary" 
            size="icon" 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-dark/80 rounded-full shadow-md hover:bg-white hover:dark:bg-gray-800 -mr-4 md:mr-0"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </Button>
          
          {/* Experience Carousel */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load experiences. Please try again.</p>
            </div>
          ) : (
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {experiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/experiences">
            <Button 
              variant="outline" 
              className="px-6 py-3 border-2 border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              View All Experiences 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;
