import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShoppingBag, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Merch() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("featured");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Product categories
  const categories = [
    { value: "all", label: "All Products" },
    { value: "Apparel", label: "Apparel" },
    { value: "Accessories", label: "Accessories" },
    { value: "Art", label: "Art & Prints" },
    { value: "Collectibles", label: "Collectibles" },
  ];

  // Apply filters and sorting
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sorting
    if (sortOrder === "price-low") {
      return a.price - b.price;
    } else if (sortOrder === "price-high") {
      return b.price - a.price;
    } else if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0; // featured - no specific sort
  });

  const handleAddToCart = (product: Product, variant?: string) => {
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
      variant: variant || undefined,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Merchandise | Immersify</title>
        <meta name="description" content="Shop Immersify merchandise including apparel, accessories, art prints, and collectibles." />
      </Helmet>

      <div className="bg-gradient-to-b from-secondary/10 to-background">
        <div className="container mx-auto px-4 py-24 pt-28">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Immersify Merchandise
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Take a piece of the experience home with our exclusive merchandise
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
                    placeholder="Search merchandise..."
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
                    <SelectValue placeholder="All products" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="grid" className="mb-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredProducts.length} products found
              </div>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="h-64 overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {product.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                      </CardContent>
                      <CardFooter>
                        <ProductVariants 
                          product={product} 
                          onAddToCart={handleAddToCart} 
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
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
                <div className="space-y-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-heading font-bold text-xl">{product.name}</h3>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {product.category}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {product.description}
                          </p>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                            <ProductVariants 
                              product={product} 
                              onAddToCart={handleAddToCart} 
                              layout="horizontal"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <section className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl mb-4">Shopping Information</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our merchandise ships worldwide, bringing the Immersify experience to you wherever you are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Free shipping on orders over $50 (US only)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>International shipping available</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Standard shipping: 3-5 business days</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 10V14M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7V7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Returns & Exchanges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>30-day return policy on unworn items</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Size exchanges available for apparel</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Contact customer service for returns</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Member Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Members receive 15% off all merchandise</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Exclusive member-only items</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Early access to new merchandise</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

// Dynamic product variants based on product category
function ProductVariants({ 
  product, 
  onAddToCart, 
  layout = "vertical" 
}: { 
  product: Product, 
  onAddToCart: (product: Product, variant?: string) => void, 
  layout?: "vertical" | "horizontal" 
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  
  // Define variants based on product category
  let variants: string[] = [];
  
  if (product.category === "Apparel") {
    variants = ["Small", "Medium", "Large", "X-Large"];
  } else if (product.category === "Art") {
    variants = ["8×10″", "12×16″", "18×24″"];
  }
  
  if (variants.length === 0) {
    return (
      <Button 
        className="w-full bg-primary hover:bg-primary/90"
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </Button>
    );
  }
  
  return (
    <div className={`w-full ${layout === "horizontal" ? "flex items-center gap-4" : "space-y-2"}`}>
      <Select onValueChange={setSelectedVariant}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${product.category === "Apparel" ? "Size" : "Option"}`} />
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant} value={variant}>
              {variant}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        className={`${layout === "horizontal" ? "flex-shrink-0" : "w-full"} bg-primary hover:bg-primary/90`}
        disabled={!selectedVariant}
        onClick={() => selectedVariant && onAddToCart(product, selectedVariant)}
      >
        Add to Cart
      </Button>
    </div>
  );
}
