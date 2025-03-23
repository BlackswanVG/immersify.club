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
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  MessageSquare,
  Building
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  location: z.string().optional(),
});

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: venues = [] } = useQuery({
    queryKey: ['/api/venues'],
  });
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll respond shortly!",
      });
      form.reset();
    }, 1500);
  }

  return (
    <>
      <Helmet>
        <title>Contact Us | Immersify</title>
        <meta name="description" content="Get in touch with the Immersify team for inquiries, support, or partnership opportunities." />
      </Helmet>

      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-24 pt-28">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We're here to help with any questions about your immersive journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Tabs defaultValue="general">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="locations">Locations</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-heading font-bold text-2xl mb-6">Get in Touch</h2>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="your.email@example.com" {...field} />
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
                                  <FormLabel>Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your phone number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a specific location" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="">All Locations / Corporate</SelectItem>
                                    {venues.map((venue: any) => (
                                      <SelectItem key={venue.id} value={venue.id.toString()}>
                                        {venue.name}, {venue.state}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input placeholder="Subject of your message" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="How can we help you?"
                                    className="min-h-[150px]"
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
                            {isSubmitting ? "Sending..." : "Send Message"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="locations" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-heading font-bold text-2xl mb-6">Our Locations</h2>
                      
                      <div className="space-y-8">
                        {venues.slice(0, 3).map((venue: any) => (
                          <div key={venue.id} className="flex border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                            <Building className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                            <div>
                              <h3 className="font-heading font-bold text-lg mb-2">{venue.name}</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300">
                                      {venue.address}<br />
                                      {venue.city}, {venue.state} {venue.zipCode}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300">(555) 123-4567</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300">{venue.slug}@immersify.com</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-start">
                                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <div className="text-gray-600 dark:text-gray-300">
                                      <div>Mon-Thu: 10:00 AM - 8:00 PM</div>
                                      <div>Fri-Sun: 10:00 AM - 10:00 PM</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-heading font-bold text-lg mb-4">Corporate Headquarters</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                285 W Broadway<br />
                                New York, NY 10013
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">(888) IMMERSE</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">contact@immersify.com</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-300">
                                Monday - Friday: 9:00 AM - 6:00 PM
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="support" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-heading font-bold text-2xl mb-6">Customer Support</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                          <div className="flex items-center mb-4">
                            <MessageSquare className="h-6 w-6 text-primary mr-3" />
                            <h3 className="font-heading font-bold text-lg">General Support</h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            For questions about experiences, venues, or general inquiries.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">support@immersify.com</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">(888) IMMERSE ext. 1</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                          <div className="flex items-center mb-4">
                            <Users className="h-6 w-6 text-primary mr-3" />
                            <h3 className="font-heading font-bold text-lg">Membership Support</h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            For questions about membership tiers, benefits, or account issues.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">members@immersify.com</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">(888) IMMERSE ext. 2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/5 rounded-lg p-6 border border-secondary/10">
                        <h3 className="font-heading font-bold text-lg mb-4">Online Support Hours</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">Monday - Friday</span>
                            <span>8:00 AM - 11:00 PM ET</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Saturday - Sunday</span>
                            <span>9:00 AM - 8:00 PM ET</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                          For urgent matters outside these hours, please leave a message and we'll respond as soon as possible.
                        </p>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="font-heading font-bold text-lg mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-primary">How do I reschedule a booking?</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                              You can reschedule bookings up to 24 hours before your experience through your account dashboard or by contacting our support team.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary">Can I get a refund if I need to cancel?</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                              Full refunds are available for cancellations made 48 hours or more before your scheduled experience. Cancellations within 48 hours may be eligible for partial credit.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary">How do I redeem a gift card?</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                              Gift cards can be redeemed during checkout by entering the code in the payment section, or by contacting our support team to apply it to your account balance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  <iframe
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAUbkW0dXzmPAnAxOxNzDxIV1KjFHLO37A&q=New+York,NY+USA"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Map of Immersify Locations"
                  ></iframe>
                </div>
                
                <div className="p-6">
                  <h2 className="font-heading font-bold text-2xl mb-6">Connect With Us</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-lg mb-1">Headquarters</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          285 W Broadway<br />
                          New York, NY 10013
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-lg mb-1">Email</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          General Inquiries: contact@immersify.com<br />
                          Support: support@immersify.com<br />
                          Press: media@immersify.com
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-lg mb-1">Phone</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Toll-Free: (888) IMMERSE<br />
                          International: +1 (212) 555-7890
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-lg mb-1">Business Hours</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Corporate: Monday - Friday, 9AM - 6PM ET<br />
                          Venues: See individual location pages for hours
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-lg mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a 
                        href="#instagram" 
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a 
                        href="#twitter" 
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Twitter"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.028 10.028 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.84 4.84 0 00-.666 2.477c0 1.71.87 3.214 2.19 4.1a4.937 4.937 0 01-2.23-.616v.061a4.928 4.928 0 003.95 4.829 4.882 4.882 0 01-2.224.085 4.934 4.934 0 004.6 3.42 9.86 9.86 0 01-6.115 2.107c-.39 0-.782-.023-1.17-.067a13.995 13.995 0 007.557 2.21c9.053 0 14-7.496 14-13.988 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59l-.047-.02z"/>
                        </svg>
                      </a>
                      <a 
                        href="#facebook" 
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                        </svg>
                      </a>
                      <a 
                        href="#youtube" 
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                        aria-label="YouTube"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </div>
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
