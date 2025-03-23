import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import BookingForm from "@/components/booking/BookingForm";
import { Check, Crown } from "lucide-react";

export default function Booking() {
  return (
    <>
      <Helmet>
        <title>Book an Experience | Immersify</title>
        <meta name="description" content="Book your next immersive adventure with Immersify. Choose from our available time slots and secure your experience today." />
      </Helmet>

      <div className="container mx-auto px-4 py-24 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <h1 className="font-heading font-bold text-3xl mb-6">
              Book Your Next <span className="text-primary">Adventure</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Choose from our available time slots and secure your immersive experience today. Members get priority booking and special rates.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl mb-8">
              <h3 className="font-heading font-semibold text-xl mb-4">Why Book With Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-3" />
                  <span>Easy rescheduling up to 24 hours before</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-3" />
                  <span>No hidden fees or charges</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-3" />
                  <span>Bundle multiple experiences for discounts</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-3" />
                  <span>All experiences include orientation</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6 border border-primary/30 rounded-xl bg-primary/5">
              <h3 className="font-heading font-semibold text-xl mb-4 flex items-center">
                <Crown className="text-yellow-500 mr-3" />
                Member Benefits
              </h3>
              <p className="mb-4">Members enjoy exclusive perks:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-xs text-primary mr-2">★</span>
                  <span>10% off all bookings</span>
                </li>
                <li className="flex items-center">
                  <span className="text-xs text-primary mr-2">★</span>
                  <span>Priority access to new experiences</span>
                </li>
                <li className="flex items-center">
                  <span className="text-xs text-primary mr-2">★</span>
                  <span>Free guest passes (Gold tier+)</span>
                </li>
              </ul>
              <a href="/membership" className="text-primary font-medium hover:underline inline-flex items-center">
                Learn about membership 
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
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
          </div>
          
          <BookingForm />
        </div>
      </div>
    </>
  );
}
