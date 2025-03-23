import { Helmet } from "react-helmet";
import MembershipTiers from "@/components/membership/MembershipTiers";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, User, Clock, Ticket, ShieldCheck, Gift } from "lucide-react";

export default function Membership() {
  return (
    <>
      <Helmet>
        <title>Membership | Immersify</title>
        <meta name="description" content="Join the Immersify Club and unlock exclusive benefits, special pricing, and members-only experiences at all our venues nationwide." />
      </Helmet>

      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-24 pt-28">
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Join The Immersify Club
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Unlock exclusive benefits, special pricing, and members-only experiences at all our venues nationwide.
            </p>
          </div>
          
          <MembershipTiers />
          
          <div className="mt-16 text-center">
            <p className="mb-4 text-white/90">All memberships include access to our nationwide network of venues</p>
            <Button 
              variant="secondary"
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
            >
              Learn More About Memberships <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-light dark:bg-dark py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Why Become a Member?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Being an Immersify member means more than just discounts. It's about joining a community of like-minded explorers and getting the most out of our experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Ticket className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Significant Savings</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save up to 25% on all experiences with our tiered discount system. The more you explore, the more you save.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>10-25% off all regular bookings</span>
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Special member-only flash sales</span>
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Birthday month bonus discount</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Clock className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Priority Access</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Be the first to experience new installations and book popular time slots before they open to the general public.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>24-72 hour advance booking window</span>
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Early access to new experiences</span>
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Reserved slots on peak days</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Gift className="text-primary h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Exclusive Perks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enjoy special member-only events, complimentary guest passes, and access to our most exclusive experiences.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Free guest passes each quarter</span>
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Exclusive member-only events</span>
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>VIP experiences not available to public</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="p-10">
                  <h3 className="font-heading font-bold text-2xl mb-4">Frequently Asked Questions</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold mb-2">How does the membership work?</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Your membership is billed monthly and gives you immediate access to all benefits based on your tier. You can upgrade, downgrade or cancel anytime.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-2">Can I share my membership with family?</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Gold and Platinum tiers include guest passes that can be used for family and friends. For regular visits, each person needs their own membership.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-2">Is there a commitment period?</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        No, all memberships are month-to-month with no long-term commitment. You can cancel at any time.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-2">Does my membership work at all locations?</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Yes! Your membership gives you access to all Immersify venues across the country, with the same benefits anywhere you go.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Member enjoying an immersive experience" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
