import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const MembershipTier = ({ tier, isPopular = false }) => {
  return (
    <div className={`backdrop-blur-sm rounded-xl overflow-hidden ${
      isPopular 
        ? "bg-white/20 transform scale-105 shadow-xl relative" 
        : "bg-white/10"
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-white text-primary font-medium text-sm px-4 py-1 rounded-bl-lg">
          Most Popular
        </div>
      )}
      <div className="p-6 text-center border-b border-white/20">
        <h3 className="font-heading font-bold text-2xl mb-2">{tier.name}</h3>
        <div className="text-3xl font-bold mb-1">
          ${tier.monthlyPrice}<span className="text-lg font-normal">/month</span>
        </div>
        <p className="text-white/80">{tier.description}</p>
      </div>
      <div className="p-6">
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <Check className="mt-1 mr-3 text-white" size={18} />
            <span>{tier.discountPercentage}% discount on all experiences</span>
          </li>
          <li className="flex items-start">
            <Check className="mt-1 mr-3 text-white" size={18} />
            <span>Priority booking ({tier.priorityBookingHours} hours advance)</span>
          </li>
          <li className="flex items-start">
            <Check className="mt-1 mr-3 text-white" size={18} />
            <span>
              {tier.name === "Silver" 
                ? "Access to all standard experiences" 
                : tier.name === "Gold" 
                ? "Access to premium experiences" 
                : "Access to exclusive VIP experiences"}
            </span>
          </li>
          <li className="flex items-start">
            <Check className="mt-1 mr-3 text-white" size={18} />
            <span>
              Member-only events (
                {tier.name === "Silver" 
                  ? "quarterly" 
                  : tier.name === "Gold" 
                  ? "monthly" 
                  : "weekly"}
              )
            </span>
          </li>
          <li className="flex items-start">
            {tier.guestPasses > 0 ? (
              <>
                <Check className="mt-1 mr-3 text-white" size={18} />
                <span>{tier.guestPasses} free guest passes per quarter</span>
              </>
            ) : (
              <>
                <X className="mt-1 mr-3 text-white/50" size={18} />
                <span className="text-white/50">Free guest passes</span>
              </>
            )}
          </li>
        </ul>
        <Button 
          className="block w-full py-3 bg-white text-primary text-center font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Join {tier.name}
        </Button>
      </div>
    </div>
  );
};

export default function MembershipTiers() {
  const { data: tiers = [], isLoading, error } = useQuery({
    queryKey: ['/api/membership-tiers'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">Unable to load membership tiers</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers.map((tier) => (
        <MembershipTier 
          key={tier.id} 
          tier={tier} 
          isPopular={tier.featuredTier}
        />
      ))}
    </div>
  );
}
