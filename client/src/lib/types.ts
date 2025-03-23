export interface CartItem {
  id: number;
  type: 'experience' | 'product';
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  dateTime?: string;
  variant?: string;
}

export interface CartContextType {
  isOpen: boolean;
  toggleCart: () => void;
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export interface Experience {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  duration: number;
  price: number;
  minAge: number;
  maxAge: number;
  requirements?: string;
  specialEquipment?: string;
  imageUrl: string;
  galleryImages?: string[];
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface Venue {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  imageUrl: string;
  isNew: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inventory: number;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: number;
  venueId: number;
  experienceId: number;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
}

export interface Booking {
  id: number;
  userId?: number;
  venueId: number;
  experienceId: number;
  date: string;
  time: string;
  numberOfTickets: number;
  ticketType: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  createdAt: string;
}

export interface MembershipTier {
  id: number;
  name: string;
  monthlyPrice: number;
  description: string;
  discountPercentage: number;
  priorityBookingHours: number;
  guestPasses: number;
  featuredTier: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  membershipTier: string;
  createdAt: string;
}
