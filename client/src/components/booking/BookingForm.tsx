import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "./Calendar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Minus } from "lucide-react";

const bookingFormSchema = z.object({
  venueId: z.string().min(1, "Please select a venue"),
  experienceId: z.string().min(1, "Please select an experience"),
  date: z.date(),
  time: z.string().min(1, "Please select a time slot"),
  numberOfTickets: z.number().min(1).max(20),
  ticketType: z.string().min(1, "Please select a ticket type"),
  customerName: z.string().min(2, "Please enter your name"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingForm() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const { toast } = useToast();
  const { addItem } = useCart();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      venueId: "",
      experienceId: "",
      date: new Date(),
      time: "",
      numberOfTickets: 2,
      ticketType: "standard",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  const venueId = form.watch("venueId");
  const experienceId = form.watch("experienceId");
  const numberOfTickets = form.watch("numberOfTickets");
  const ticketType = form.watch("ticketType");

  // Fetch venues
  const { data: venues = [] } = useQuery({
    queryKey: ["/api/venues"],
  });

  // Fetch experiences based on selected venue
  const { data: experiences = [], isLoading: isLoadingExperiences } = useQuery({
    queryKey: ["/api/venues", venueId, "experiences"],
    queryFn: async () => {
      if (!venueId) return [];
      const response = await fetch(`/api/venues/${venueId}/experiences`);
      if (!response.ok) throw new Error("Failed to fetch experiences");
      return response.json();
    },
    enabled: !!venueId,
  });

  // Fetch availability slots
  const { data: availabilitySlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: [
      "/api/availability",
      {
        venueId,
        experienceId,
        date: date ? format(date, "yyyy-MM-dd") : "",
      },
    ],
    queryFn: async () => {
      if (!venueId || !experienceId || !date) return [];
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(
        `/api/availability?venueId=${venueId}&experienceId=${experienceId}&date=${formattedDate}`
      );
      if (!response.ok) throw new Error("Failed to fetch availability");
      return response.json();
    },
    enabled: !!venueId && !!experienceId && !!date,
  });

  // Calculate prices
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [pricing, setPricing] = useState({
    ticketPrice: 0,
    totalTickets: 0,
    subtotal: 0,
    bookingFee: 0,
    total: 0,
  });

  useEffect(() => {
    if (experienceId && experiences.length > 0) {
      const experience = experiences.find(
        (exp) => exp.id.toString() === experienceId
      );
      setSelectedExperience(experience);
    }
  }, [experienceId, experiences]);

  useEffect(() => {
    if (selectedExperience) {
      let basePrice = selectedExperience.price;
      let discount = 0;

      // Apply discount based on ticket type
      switch (ticketType) {
        case "member":
          discount = 0.1; // 10% discount
          break;
        case "group":
          discount = numberOfTickets >= 5 ? 0.1 : 0; // 10% for 5+ tickets
          break;
        case "family":
          // Family pack is fixed price for 4
          break;
      }

      let ticketPrice = basePrice * (1 - discount);
      let subtotal =
        ticketType === "family" ? 112 : ticketPrice * numberOfTickets;
      let bookingFee = Math.round(subtotal * 0.06 * 100) / 100; // 6% booking fee
      let total = subtotal + bookingFee;

      setPricing({
        ticketPrice,
        totalTickets: ticketType === "family" ? 4 : numberOfTickets,
        subtotal,
        bookingFee,
        total,
      });
    }
  }, [selectedExperience, numberOfTickets, ticketType]);

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      return apiRequest("POST", "/api/bookings", {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
        venueId: parseInt(data.venueId),
        experienceId: parseInt(data.experienceId),
        totalPrice: pricing.total,
      });
    },
    onSuccess: async (response) => {
      const booking = await response.json();
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${selectedExperience?.name} has been confirmed.`,
      });

      // Add to cart
      if (selectedExperience) {
        addItem({
          id: Date.now(),
          type: "experience",
          name: selectedExperience.name,
          price: pricing.total,
          quantity: 1,
          imageUrl: selectedExperience.imageUrl,
          dateTime: `${format(date, "MMM d, yyyy")} at ${format(
            new Date(`2000-01-01T${form.getValues("time")}`),
            "h:mm a"
          )}`,
        });
      }

      // Reset form
      form.reset();
      setSelectedTimeSlot("");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: BookingFormValues) {
    bookingMutation.mutate(data);
  }

  function incrementTickets() {
    const current = form.getValues("numberOfTickets");
    if (current < 20) {
      form.setValue("numberOfTickets", current + 1);
    }
  }

  function decrementTickets() {
    const current = form.getValues("numberOfTickets");
    if (current > 1) {
      form.setValue("numberOfTickets", current - 1);
    }
  }

  function handleTimeSelect(time: string) {
    setSelectedTimeSlot(time);
    form.setValue("time", time);
  }

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <h3 className="font-heading font-bold text-2xl">Book an Experience</h3>
        <p>Select venue, experience, date and time to continue</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              control={form.control}
              name="venueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a venue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="experienceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!venueId || isLoadingExperiences}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an experience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experiences.map((experience: any) => (
                        <SelectItem
                          key={experience.id}
                          value={experience.id.toString()}
                        >
                          {experience.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Date</FormLabel>
                  <FormControl>
                    <Calendar 
                      mode="single"
                      selected={field.value} 
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                          setDate(date);
                        }
                      }}
                      disabled={!venueId || !experienceId}
                      className="rounded-md border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Time Slots</FormLabel>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {isLoadingSlots ? (
                      <div className="col-span-full flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : availabilitySlots.length === 0 ? (
                      <p className="col-span-full text-center py-4 text-gray-500">
                        No available time slots for the selected date
                      </p>
                    ) : (
                      availabilitySlots.map((slot: any) => {
                        const isAvailable =
                          slot.capacity - slot.bookedCount >= numberOfTickets;
                        const isSelected = slot.time === selectedTimeSlot;
                        return (
                          <button
                            type="button"
                            key={slot.id}
                            onClick={() => isAvailable && handleTimeSelect(slot.time)}
                            className={`text-center py-2 border rounded-md transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : isAvailable
                                ? "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"
                                : "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!isAvailable}
                          >
                            {format(
                              new Date(`2000-01-01T${slot.time}`),
                              "h:mm a"
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              control={form.control}
              name="numberOfTickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tickets</FormLabel>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-r-none"
                      onClick={decrementTickets}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="rounded-none text-center"
                        onChange={(e) => 
                          field.onChange(
                            Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-l-none"
                      onClick={incrementTickets}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ticketType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (${selectedExperience?.price ?? 0} each)
                      </SelectItem>
                      <SelectItem value="member">
                        Member ({(selectedExperience?.price ?? 0) * 0.9} each)
                      </SelectItem>
                      <SelectItem value="group">
                        Group 5+ (${(selectedExperience?.price ?? 0) * 0.9} each)
                      </SelectItem>
                      <SelectItem value="family">
                        Family Pack ($112 for 4)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 mb-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-6" />

          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span>
                {pricing.totalTickets} × {ticketType === "member" ? "Member" : ticketType === "group" ? "Group" : ticketType === "family" ? "Family Pack" : "Standard"} Tickets
              </span>
              <span>${pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Booking Fee</span>
              <span>${pricing.bookingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${pricing.total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            disabled={bookingMutation.isPending}
          >
            {bookingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Checkout"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
