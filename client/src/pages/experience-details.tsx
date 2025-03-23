import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, Users, Info, Calendar, ArrowRight, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="aspect-video">
        <img
          src={images[currentIndex]}
          alt="Experience"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function ExperienceDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);

  const { data: experience, isLoading } = useQuery({
    queryKey: [`/api/experiences/${slug}`],
    enabled: !!slug,
  });

  // Fake gallery images for demo
  const galleryImages = [
    experience?.imageUrl || '',
    'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ];

  const { data: venues = [] } = useQuery({
    queryKey: ['/api/venues'],
    enabled: !!experience,
  });

  // Get venues that offer this experience
  const availableVenues = venues.filter((venue: any) => {
    // This is a simplification - in a real app, you'd check venueExperiences
    return true;
  });

  useEffect(() => {
    if (availableVenues.length > 0 && !selectedVenue) {
      setSelectedVenue(availableVenues[0]);
    }
  }, [availableVenues, selectedVenue]);

  // Get availability for the selected venue and date
  const { data: slots = [] } = useQuery({
    queryKey: [
      '/api/availability', 
      { 
        venueId: selectedVenue?.id, 
        experienceId: experience?.id, 
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined 
      }
    ],
    enabled: !!selectedVenue && !!experience && !!selectedDate,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 pt-28">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="container mx-auto px-4 py-24 pt-28">
        <div className="text-center py-20">
          <h1 className="font-heading font-bold text-2xl mb-4">Experience not found</h1>
          <p className="mb-6">The experience you're looking for doesn't exist or has been removed.</p>
          <Link href="/experiences">
            <Button>View All Experiences</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{experience.name} | Immersify</title>
        <meta name="description" content={experience.shortDescription} />
      </Helmet>

      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-24 pt-28">
          <Link href="/experiences" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all experiences
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <h1 className="font-heading font-bold text-3xl md:text-4xl">{experience.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="font-medium">4.9</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">(412 reviews)</span>
                  </div>
                  {experience.isPopular && (
                    <Badge className="bg-primary">Popular</Badge>
                  )}
                  {experience.isNew && (
                    <Badge className="bg-secondary">New</Badge>
                  )}
                </div>
              </div>
              
              <ImageGallery images={galleryImages.filter(Boolean)} />
              
              <Tabs defaultValue="description" className="mt-8">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-0">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg mb-4">{experience.shortDescription}</p>
                    <p>{experience.description}</p>
                    
                    {experience.specialEquipment && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
                        <div className="flex">
                          <AlertTriangle className="text-amber-600 dark:text-amber-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-amber-800 dark:text-amber-500 font-medium mb-1">Special Requirements</h3>
                            <p className="text-amber-700 dark:text-amber-400 text-sm">{experience.specialEquipment}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Duration</h3>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{experience.duration} minutes</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Age Requirements</h3>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-2" />
                          <span>
                            {experience.minAge === 0 
                              ? 'Suitable for all ages' 
                              : `Minimum age: ${experience.minAge} years`}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Group Size</h3>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-2" />
                          <span>Up to 20 people per group</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">What's Included</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Full experience access</li>
                          <li>Professional guide</li>
                          <li>Orientation session</li>
                          <li>Photos of your experience</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">What to Bring</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Comfortable clothing</li>
                          <li>Socks (required for most experiences)</li>
                          <li>Your sense of adventure!</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-0">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium">SK</span>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold mr-2">Sarah K.</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 mr-0.5" fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          "Immersify completely blew my mind! This experience made me feel like I was in another dimension. Can't wait to go back!"
                        </p>
                        <p className="text-sm text-gray-500 mt-1">July 9, 2023</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium">JD</span>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold mr-2">John D.</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 mr-0.5" fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          "One of the most unique experiences of my life. The staff was incredibly helpful and the technology is cutting edge."
                        </p>
                        <p className="text-sm text-gray-500 mt-1">June 28, 2023</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium">RL</span>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold mr-2">Rebecca L.</h3>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-500 mr-0.5" fill="currentColor" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300 mr-0.5" />
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          "Brought my kids and they had a blast! Great for the whole family. Only giving 4 stars because it gets crowded on weekends."
                        </p>
                        <p className="text-sm text-gray-500 mt-1">June 15, 2023</p>
                      </div>
                    </div>
                    
                    <div className="text-center pt-4">
                      <Button variant="outline">Load More Reviews</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-28">
                <div className="text-2xl font-bold mb-1">${experience.price}<span className="text-base font-normal text-gray-500 dark:text-gray-400"> / person</span></div>
                
                <div className="flex items-center text-sm mb-6">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-medium">4.9</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">(412 reviews)</span>
                </div>
                
                <Separator className="mb-6" />
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      value={selectedVenue?.id}
                      onChange={(e) => {
                        const venue = availableVenues.find((v: any) => v.id.toString() === e.target.value);
                        setSelectedVenue(venue);
                      }}
                    >
                      {availableVenues.map((venue: any) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}, {venue.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <div 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.length === 0 ? (
                        <p className="col-span-3 text-sm text-gray-500">
                          {selectedDate ? 'No available times on this date' : 'Select a date to see available times'}
                        </p>
                      ) : (
                        slots.map((slot: any) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`text-center py-1.5 border rounded-md hover:border-primary hover:bg-primary/5 ${
                              selectedTime === slot.time ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {format(new Date(`2000-01-01T${slot.time}`), 'h:mm a')}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <div className="flex gap-2 items-start">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">Membership Benefit</h4>
                      <p className="text-sm">Members save up to 25% on all experiences. <a href="/membership" className="text-primary underline">Learn more</a></p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  size="lg"
                  onClick={() => {
                    if (experience) {
                      addItem({
                        id: Date.now(),
                        type: 'experience',
                        name: experience.name,
                        price: experience.price,
                        quantity: 1,
                        imageUrl: experience.imageUrl,
                        dateTime: selectedDate && selectedTime 
                          ? `${format(selectedDate, 'MMM d, yyyy')} at ${format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}`
                          : 'Schedule later'
                      });
                    }
                  }}
                >
                  Add to Cart
                </Button>
                
                <div className="text-center mt-4">
                  <Link href="/booking">
                    <Button variant="link" className="text-primary">
                      Or book directly
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
