import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Experiences() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("popular");

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['/api/experiences'],
  });

  // Apply filters and sorting
  const filteredExperiences = experiences.filter((experience: any) => {
    // Search filter
    const matchesSearch = experience.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          experience.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    let matchesCategory = true;
    if (filterCategory === "new") {
      matchesCategory = experience.isNew;
    } else if (filterCategory === "popular") {
      matchesCategory = experience.isPopular;
    } else if (filterCategory === "kids") {
      matchesCategory = experience.minAge <= 5;
    } else if (filterCategory === "adults") {
      matchesCategory = experience.minAge >= 18;
    }
    
    return matchesSearch && matchesCategory;
  }).sort((a: any, b: any) => {
    // Sorting
    if (sortOrder === "popular") {
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    } else if (sortOrder === "newest") {
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    } else if (sortOrder === "price-low") {
      return a.price - b.price;
    } else if (sortOrder === "price-high") {
      return b.price - a.price;
    } else if (sortOrder === "duration") {
      return a.duration - b.duration;
    }
    return 0;
  });

  return (
    <>
      <Helmet>
        <title>Experiences | Immersify</title>
        <meta name="description" content="Explore our range of immersive experiences from cosmic playgrounds to gravity-defying adventures." />
      </Helmet>

      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-24 pt-28">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Extraordinary Experiences
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover worlds beyond imagination with our immersive experiences
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search experiences..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All experiences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All experiences</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="new">New arrivals</SelectItem>
                    <SelectItem value="kids">Kid-friendly</SelectItem>
                    <SelectItem value="adults">Adults only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Most popular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Found {filteredExperiences.length} experiences
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExperiences.map((experience: any) => (
                  <Card key={experience.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative h-52 overflow-hidden">
                      <img 
                        src={experience.imageUrl} 
                        alt={experience.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      {experience.isPopular && (
                        <Badge className="absolute top-3 right-3 bg-primary">
                          Popular
                        </Badge>
                      )}
                      {experience.isNew && (
                        <Badge className="absolute top-3 right-3 bg-secondary">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle>{experience.name}</CardTitle>
                      
                      <div className="flex items-center text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                          <span className="font-medium">4.9</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1">(412 reviews)</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{experience.shortDescription}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {experience.duration} min
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {experience.minAge === 0 ? 'All ages' : `${experience.minAge}+`}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Daily
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4">
                      <div className="font-bold text-lg">
                        ${experience.price.toFixed(2)}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / person</span>
                      </div>
                      
                      <Link href={`/experience/${experience.slug}`}>
                        <Button className="bg-primary hover:bg-primary/90">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
