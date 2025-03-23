import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ParkingCircle, 
  Coffee,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience, Venue as VenueType } from "@/lib/types";

export default function Venue() {
  const { slug } = useParams();
  
  const { data: venue, isLoading: venueLoading } = useQuery<VenueType>({
    queryKey: [`/api/venues/${slug}`],
    enabled: !!slug,
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: [`/api/venues/${slug}/experiences`],
    enabled: !!slug && !!venue,
  });

  if (venueLoading) {
    return (
      <div className="container mx-auto px-4 py-24 pt-28">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container mx-auto px-4 py-24 pt-28">
        <div className="text-center py-20">
          <h1 className="font-heading font-bold text-2xl mb-4">Venue not found</h1>
          <p className="mb-6">The venue you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{venue.name} | Immersify</title>
        <meta name="description" content={`Visit our ${venue.name} venue - ${venue.description}`} />
      </Helmet>

      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-24 pt-28">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all venues
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <h1 className="font-heading font-bold text-3xl md:text-4xl">{venue.name}</h1>
                {venue.isNew && (
                  <Badge className="bg-yellow-500">New</Badge>
                )}
              </div>
              
              <div className="relative mb-8 rounded-xl overflow-hidden">
                <img 
                  src={venue.imageUrl} 
                  alt={venue.name}
                  className="w-full h-auto object-cover rounded-xl" 
                />
              </div>
              
              <Tabs defaultValue="info" className="mt-8">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="info">Venue Info</TabsTrigger>
                  <TabsTrigger value="experiences">Experiences</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="map">Map & Directions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="mt-0">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg mb-4">{venue.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                      <div>
                        <h3 className="text-xl font-medium mb-4">Hours & Location</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Operating Hours</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Monday - Thursday: 10:00 AM - 8:00 PM<br />
                                Friday - Sunday: 10:00 AM - 10:00 PM
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Address</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {venue.address}<br />
                                {venue.city}, {venue.state} {venue.zipCode}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Contact</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                (555) 123-4567
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {venue.slug}@immersify.com
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-medium mb-4">Amenities</h3>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <ParkingCircle className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Parking</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Validated parking available at adjacent garage.<br />
                                $5 for up to 3 hours with validation.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Coffee className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Café & Refreshments</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Our clean-eating café offers organic snacks, smoothies, and coffee to fuel your adventure.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-primary mt-1 mr-3" />
                            <div>
                              <p className="font-medium">Private Events</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Available for corporate events and private parties. Contact us for details.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Safety Information</h3>
                      <p className="mb-4">For your safety and comfort during your visit:</p>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Comfortable, closed-toe shoes recommended for all experiences</li>
                        <li>All experiences include orientation before participation</li>
                        <li>Lockers available to store personal belongings</li>
                        <li>Experience-specific requirements will be communicated upon booking</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="experiences" className="mt-0">
                  <h3 className="text-xl font-medium mb-6">Available Experiences at {venue.name}</h3>
                  
                  {experiencesLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : experiences.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No experiences available at this location yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {experiences.map((experience) => (
                        <Card key={experience.id} className="overflow-hidden transition-all hover:shadow-lg">
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={experience.imageUrl} 
                              alt={experience.name} 
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xl">{experience.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                              {experience.shortDescription}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {experience.duration} min • ${experience.price}
                              </div>
                              <Link href={`/experience/${experience.slug}`}>
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-8 text-center">
                    <Link href="/booking">
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        Book an Experience at {venue.name}
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
                
                <TabsContent value="gallery" className="mt-0">
                  <h3 className="text-xl font-medium mb-6">Gallery</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div key={num} className="rounded-lg overflow-hidden aspect-square">
                        <img 
                          src={`https://source.unsplash.com/random/300x300?immersive,experience&sig=${venue.slug}${num}`}
                          alt={`${venue.name} gallery image ${num}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="map" className="mt-0">
                  <h3 className="text-xl font-medium mb-6">Location & Directions</h3>
                  
                  <div className="rounded-lg overflow-hidden mb-8 aspect-video">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAUbkW0dXzmPAnAxOxNzDxIV1KjFHLO37A&q=${encodeURIComponent(
                        `${venue.address}, ${venue.city}, ${venue.state} ${venue.zipCode}`
                      )}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title={`Map of ${venue.name}`}
                    ></iframe>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-lg mb-3">Getting Here</h4>
                      <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <p>
                          <strong>By Public Transit:</strong> Take the Metro Red Line to Union Station. Our venue is a 5-minute walk from the east exit.
                        </p>
                        <p>
                          <strong>By Car:</strong> From the highway, take exit 23B and follow the signs for downtown. We're located on the corner of Broadway and 7th Street.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg mb-3">Parking Information</h4>
                      <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <p>Validated parking is available at the adjacent parking structure on 8th Street.</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>$5 for up to 3 hours with validation</li>
                          <li>$15 for 3-5 hours with validation</li>
                          <li>$25 maximum daily rate</li>
                        </ul>
                        <p>Street parking is also available but limited during peak hours.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-28">
                <h3 className="font-heading font-bold text-xl mb-4">Book Your Visit</h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Ready to experience the extraordinary at our {venue.name} location? Book an experience now to secure your spot.
                </p>
                
                <Link href="/booking">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white mb-4">
                    Book an Experience
                  </Button>
                </Link>
                
                <div className="space-y-6 mt-8">
                  <div>
                    <h4 className="font-medium mb-2 text-lg">Opening Hours</h4>
                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Monday - Thursday</span>
                        <span>10:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Friday - Sunday</span>
                        <span>10:00 AM - 10:00 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-lg">Contact Information</h4>
                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{venue.slug}@immersify.com</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h4 className="font-medium mb-2 text-primary">Member Benefits</h4>
                    <p className="text-sm mb-2">Members enjoy special perks at this location:</p>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <li className="flex items-center">
                        <span className="text-xs text-primary mr-2">★</span>
                        <span>Discounted experience pricing</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-xs text-primary mr-2">★</span>
                        <span>Priority booking windows</span>
                      </li>
                      <li className="flex items-center">
                        <span className="text-xs text-primary mr-2">★</span>
                        <span>Free parking validation</span>
                      </li>
                    </ul>
                    
                    <Link href="/membership" className="text-primary text-sm font-medium flex items-center mt-3 hover:underline">
                      Learn about membership
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
