import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  DollarSign, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  Calendar, 
  FileText, 
  Upload,
  Lock
} from "lucide-react";

const franchiseFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please select your state"),
  investmentLevel: z.string().min(1, "Please select your investment level"),
  timeframe: z.string().min(1, "Please select your timeframe"),
  message: z.string().optional(),
});

export default function Franchise() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof franchiseFormSchema>>({
    resolver: zodResolver(franchiseFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      investmentLevel: "",
      timeframe: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof franchiseFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your interest! Our franchise team will contact you shortly.",
      });
      form.reset();
    }, 1500);
  }

  return (
    <>
      <Helmet>
        <title>Franchise Opportunities | Immersify</title>
        <meta name="description" content="Explore Immersify franchise opportunities and join our growing network of immersive experience venues." />
      </Helmet>

      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-24 pt-28">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              Franchise Opportunities
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Join our growing network of immersive experience venues and bring the future of entertainment to your city.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="font-heading font-bold text-3xl mb-6">
                Why Partner with <span className="text-primary">Immersify</span>?
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                As an Immersify franchise owner, you'll be at the forefront of the rapidly expanding immersive entertainment industry, with a proven business model and comprehensive support system.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <Building2 />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Proven Business Model</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Access our operational excellence with a business model refined across multiple successful locations.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <DollarSign />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Strong ROI Potential</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Benefit from multiple revenue streams: experiences, memberships, merchandise, and private events.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0">
                    <Users />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Comprehensive Support</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      From site selection to grand opening and beyond, our team provides industry-leading training and support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary rounded-lg opacity-20 animate-pulse delay-700"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Franchise partners discussing business" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-20">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-8">
              <h2 className="font-heading font-bold text-2xl md:text-3xl">
                Franchise Requirements & Investment
              </h2>
              <p>Explore what it takes to become an Immersify franchise partner</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      Investment Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-1">$750K - $1.2M</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Includes franchise fee, construction, equipment, and initial marketing
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Space Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-1">8,000 - 12,000 sq ft</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Prime retail or entertainment district locations preferred
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Time to Open
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-1">6-9 Months</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      From signing agreement to grand opening
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-4 flex items-center">
                    <CheckCircle className="text-green-500 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Proprietary experience designs and technology</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Comprehensive training program for all staff levels</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Marketing playbook and launch campaign support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Access to our proprietary booking platform</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Ongoing experience updates and innovations</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-4">Ideal Franchise Partner</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Business experience with multi-unit management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Net worth of $1.5M+ with $500K+ liquid capital</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Passion for innovation and customer experience</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Strong ties to local community and business networks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Commitment to the Immersify brand values and vision</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="inquiry">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="inquiry">Franchise Inquiry</TabsTrigger>
                <TabsTrigger value="faq">FAQs</TabsTrigger>
                <TabsTrigger value="portal">Franchisee Portal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inquiry" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="font-heading font-bold text-2xl mb-6 text-center">Start Your Franchise Journey</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City of Interest</FormLabel>
                            <FormControl>
                              <Input placeholder="Where you'd like to open" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AL">Alabama</SelectItem>
                                <SelectItem value="AK">Alaska</SelectItem>
                                <SelectItem value="AZ">Arizona</SelectItem>
                                {/* More states would go here */}
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="NY">New York</SelectItem>
                                <SelectItem value="TX">Texas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="investmentLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Investment</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select investment level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="$500K - $750K">$500K - $750K</SelectItem>
                                <SelectItem value="$750K - $1M">$750K - $1M</SelectItem>
                                <SelectItem value="$1M - $1.5M">$1M - $1.5M</SelectItem>
                                <SelectItem value="$1.5M+">$1.5M+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeframe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your timeframe" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Immediate">Immediate (0-3 months)</SelectItem>
                                <SelectItem value="Short-term">Short-term (3-6 months)</SelectItem>
                                <SelectItem value="Medium-term">Medium-term (6-12 months)</SelectItem>
                                <SelectItem value="Long-term">Long-term (12+ months)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your background, relevant experience, or any questions you may have"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Franchise Inquiry"}
                    </Button>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      By submitting this form, you agree to our privacy policy and consent to be contacted about franchise opportunities.
                    </p>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="faq" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h3 className="font-heading font-bold text-2xl mb-6 text-center">Frequently Asked Questions</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is the franchise fee and royalty structure?</AccordionTrigger>
                    <AccordionContent>
                      The initial franchise fee is $75,000 for a single unit. Ongoing royalties are 6% of gross sales, and the marketing contribution is 2% of gross sales. Multi-unit development deals with discounted fees are available for qualified candidates.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What territories are currently available?</AccordionTrigger>
                    <AccordionContent>
                      We're currently expanding across the United States with a focus on major metropolitan areas with populations of 500,000+. Key markets currently available include Phoenix, Denver, Dallas, Atlanta, and many others. International territories are also under consideration.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What support is provided for site selection and build-out?</AccordionTrigger>
                    <AccordionContent>
                      Our real estate team provides comprehensive support including demographic analysis, site evaluation criteria, lease negotiation assistance, and connections to pre-approved architects and contractors. We provide detailed construction plans and specifications, and our project managers will guide you through the entire build-out process.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How long is the training program?</AccordionTrigger>
                    <AccordionContent>
                      Our comprehensive training program includes 3 weeks at our headquarters covering operations, technology, customer experience, and management. Additionally, our opening team spends 2 weeks on-site during your launch to ensure a successful grand opening. Ongoing training and updates are provided throughout the franchise relationship.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger>What is the typical ROI timeframe?</AccordionTrigger>
                    <AccordionContent>
                      While results vary based on market, location, and management, our established venues typically see investment recoupment within 24-36 months. The multi-revenue stream business model (experiences, memberships, retail, and private events) provides diverse income channels and helps stabilize cash flow throughout the year.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="mt-8 p-6 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-heading font-semibold text-lg mb-4 flex items-center">
                    <Calendar className="text-primary mr-2" />
                    Schedule a Discovery Call
                  </h4>
                  <p className="mb-4">
                    Want to learn more? Schedule a one-on-one discovery call with our franchise development team to get detailed answers to your specific questions.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Book a Call
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="portal" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                    <Lock className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-4">Franchisee Portal</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                    Secure access to training materials, operational resources, marketing assets, and support ticketing system for current Immersify franchise partners.
                  </p>
                  
                  <div className="max-w-md mx-auto">
                    <Button className="w-full bg-primary hover:bg-primary/90 mb-4">
                      Login to Franchisee Portal
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Not a franchisee yet? <a href="#" className="text-primary hover:underline">Submit an inquiry</a> to learn more about joining the Immersify network.
                    </p>
                  </div>
                </div>
                
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        Operations Manual
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Access comprehensive operations guidelines and standard procedures
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Upload className="h-5 w-5 mr-2 text-primary" />
                        Marketing Assets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Download approved marketing materials, logos, and campaign templates
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center text-lg">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Training Center
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        On-demand training videos and materials for your team members
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
