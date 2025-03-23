import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const VenueCard = ({ venue }) => {
  const { data: venueExperiences = [] } = useQuery({
    queryKey: [`/api/venues/${venue.slug}/experiences`],
    enabled: !!venue.slug,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02]">
      <img 
        src={venue.imageUrl} 
        alt={`${venue.name} Venue`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl mb-3">{venue.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{venue.description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-5">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{venue.address}, {venue.city}, {venue.state} {venue.zipCode}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {venueExperiences.slice(0, 3).map((experience) => (
            <Badge 
              key={experience.id}
              variant="outline" 
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {experience.name}
            </Badge>
          ))}
          {venue.isNew && (
            <Badge 
              variant="outline"
              className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm"
            >
              New
            </Badge>
          )}
        </div>
        <Link href={`/venue/${venue.slug}`}>
          <Button variant="link" className="inline-flex items-center font-medium text-primary hover:underline p-0">
            View Venue Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const VenueHighlight = () => {
  const { data: venues = [], isLoading, error } = useQuery({
    queryKey: ['/api/venues'],
    select: (data) => data || [],
  });

  return (
    <section className="py-20 bg-light dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Our Flagship Venues
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our growing network of immersive venues across the country. Each location offers a unique blend of our core experiences plus regional specialties.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load venues. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link href="/venues">
            <Button 
              variant="outline" 
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors"
            >
              View All Venues
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VenueHighlight;
