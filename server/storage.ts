import {
  users, type User, type InsertUser,
  experiences, type Experience, type InsertExperience,
  venues, type Venue, type InsertVenue,
  venueExperiences, type VenueExperience, type InsertVenueExperience,
  availabilitySlots, type AvailabilitySlot, type InsertAvailabilitySlot,
  bookings, type Booking, type InsertBooking,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  membershipTiers, type MembershipTier, type InsertMembershipTier
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Experiences
  getAllExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  getExperienceBySlug(slug: string): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experienceData: Partial<Experience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;

  // Venues
  getAllVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;
  getVenueBySlug(slug: string): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venueData: Partial<Venue>): Promise<Venue | undefined>;
  getVenueExperiences(venueId: number): Promise<Experience[]>;

  // Venue Experiences
  createVenueExperience(venueExperience: InsertVenueExperience): Promise<VenueExperience>;
  getVenueExperiencesByVenueId(venueId: number): Promise<VenueExperience[]>;
  getVenueExperiencesByExperienceId(experienceId: number): Promise<VenueExperience[]>;

  // Availability Slots
  getAvailabilitySlots(venueId: number, experienceId: number, date: string): Promise<AvailabilitySlot[]>;
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  updateAvailabilitySlot(id: number, slotData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot | undefined>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined>;

  // Cart Items
  getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId?: number, sessionId?: string): Promise<boolean>;

  // Membership Tiers
  getAllMembershipTiers(): Promise<MembershipTier[]>;
  getMembershipTier(id: number): Promise<MembershipTier | undefined>;
  getMembershipTierByName(name: string): Promise<MembershipTier | undefined>;
  createMembershipTier(tier: InsertMembershipTier): Promise<MembershipTier>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private experiences: Map<number, Experience>;
  private venues: Map<number, Venue>;
  private venueExperiences: Map<number, VenueExperience>;
  private availabilitySlots: Map<number, AvailabilitySlot>;
  private bookings: Map<number, Booking>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private membershipTiers: Map<number, MembershipTier>;
  
  private userIdCounter: number;
  private experienceIdCounter: number;
  private venueIdCounter: number;
  private venueExperienceIdCounter: number;
  private availabilitySlotIdCounter: number;
  private bookingIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private membershipTierIdCounter: number;

  constructor() {
    this.users = new Map();
    this.experiences = new Map();
    this.venues = new Map();
    this.venueExperiences = new Map();
    this.availabilitySlots = new Map();
    this.bookings = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.membershipTiers = new Map();
    
    this.userIdCounter = 1;
    this.experienceIdCounter = 1;
    this.venueIdCounter = 1;
    this.venueExperienceIdCounter = 1;
    this.availabilitySlotIdCounter = 1;
    this.bookingIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.membershipTierIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add membership tiers
    const silverTier = this.createMembershipTier({
      name: "Silver",
      monthlyPrice: 19,
      description: "Perfect for occasional visitors",
      discountPercentage: 10,
      priorityBookingHours: 24,
      guestPasses: 0,
      featuredTier: false
    });

    const goldTier = this.createMembershipTier({
      name: "Gold",
      monthlyPrice: 39,
      description: "Great for regular explorers",
      discountPercentage: 15,
      priorityBookingHours: 48,
      guestPasses: 2,
      featuredTier: true
    });

    const platinumTier = this.createMembershipTier({
      name: "Platinum",
      monthlyPrice: 79,
      description: "For the true enthusiasts",
      discountPercentage: 25,
      priorityBookingHours: 72,
      guestPasses: 6,
      featuredTier: false
    });

    // Add experiences
    const cosmicPlayground = this.createExperience({
      name: "Cosmic Playground",
      slug: "cosmic-playground",
      description: "Enter a world where physics doesn't exist, and create your own cosmic sculptures using cutting-edge technology that responds to your movements and thoughts.",
      shortDescription: "Enter a world where physics doesn't exist, and create your own cosmic sculptures.",
      duration: 60,
      price: 32,
      minAge: 0,
      maxAge: 100,
      requirements: "None",
      specialEquipment: "No special equipment",
      imageUrl: "https://images.unsplash.com/photo-1576239319969-84afb35af6b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      isNew: false,
    });

    const digitalForest = this.createExperience({
      name: "Digital Forest",
      slug: "digital-forest",
      description: "Walk through a responsive forest of light that reacts to your movement and touch. Experience nature reimagined through digital artistry and interactive technology.",
      shortDescription: "Walk through a responsive forest of light that reacts to your movement and touch.",
      duration: 45,
      price: 28,
      minAge: 0,
      maxAge: 100,
      requirements: "None",
      specialEquipment: "Socks required",
      imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isPopular: false,
      isNew: false,
    });

    const dreamMachine = this.createExperience({
      name: "Dream Machine",
      slug: "dream-machine",
      description: "Put on a special headset and watch your dreams come to life in our projection room. Our Dream Machine translates brainwaves into vivid digital landscapes.",
      shortDescription: "Put on a special headset and watch your dreams come to life in our projection room.",
      duration: 30,
      price: 38,
      minAge: 12,
      maxAge: 100,
      requirements: "Ages 12+",
      specialEquipment: "Equipment provided",
      imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isPopular: false,
      isNew: true,
    });

    const gravityDefier = this.createExperience({
      name: "Gravity Defier",
      slug: "gravity-defier",
      description: "Zip around our specially designed gravity chamber and experience weightlessness. Defy the laws of physics and experience the sensation of floating in space.",
      shortDescription: "Zip around our specially designed gravity chamber and experience weightlessness.",
      duration: 50,
      price: 45,
      minAge: 8,
      maxAge: 100,
      requirements: "Ages 8+",
      specialEquipment: "Special outfit required",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isPopular: false,
      isNew: false,
    });

    // Add venues
    const nycVenue = this.createVenue({
      name: "New York City",
      slug: "nyc",
      address: "285 W Broadway",
      city: "New York",
      state: "NY",
      zipCode: "10013",
      description: "Located in the heart of Manhattan, our NYC venue spans 3 floors with 12 unique experience rooms.",
      imageUrl: "https://images.unsplash.com/photo-1582747448797-c78208e676c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isNew: false,
    });

    const laVenue = this.createVenue({
      name: "Los Angeles",
      slug: "la",
      address: "650 S Santa Fe Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90021",
      description: "Our LA venue features both indoor and outdoor immersive experiences in a converted warehouse space.",
      imageUrl: "https://images.unsplash.com/photo-1574234583025-ca2f4e1e1514?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isNew: false,
    });

    const chicagoVenue = this.createVenue({
      name: "Chicago",
      slug: "chicago",
      address: "401 N Morgan St",
      city: "Chicago",
      state: "IL",
      zipCode: "60642",
      description: "Our newest location in Chicago's West Loop features cutting-edge technology and innovative experiences.",
      imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      isNew: true,
    });

    // Link experiences to venues
    this.createVenueExperience({
      venueId: nycVenue.id,
      experienceId: cosmicPlayground.id,
      isExclusive: false,
    });
    
    this.createVenueExperience({
      venueId: nycVenue.id,
      experienceId: digitalForest.id,
      isExclusive: false,
    });
    
    this.createVenueExperience({
      venueId: nycVenue.id,
      experienceId: gravityDefier.id,
      isExclusive: false,
    });

    this.createVenueExperience({
      venueId: laVenue.id,
      experienceId: dreamMachine.id,
      isExclusive: false,
    });
    
    this.createVenueExperience({
      venueId: laVenue.id,
      experienceId: digitalForest.id,
      isExclusive: false,
    });
    
    this.createVenueExperience({
      venueId: laVenue.id,
      experienceId: cosmicPlayground.id,
      isExclusive: false,
    });

    this.createVenueExperience({
      venueId: chicagoVenue.id,
      experienceId: gravityDefier.id,
      isExclusive: false,
    });
    
    this.createVenueExperience({
      venueId: chicagoVenue.id,
      experienceId: dreamMachine.id,
      isExclusive: false,
    });

    // Add products
    this.createProduct({
      name: "Immersify T-Shirt",
      slug: "immersify-tshirt",
      description: "Show your love for immersive experiences with our premium cotton t-shirt featuring the Immersify logo.",
      price: 25,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      category: "Apparel",
      inventory: 100,
    });
    
    this.createProduct({
      name: "Digital Forest Poster",
      slug: "digital-forest-poster",
      description: "A beautiful 18x24 inch poster of our Digital Forest experience.",
      price: 15,
      imageUrl: "https://images.unsplash.com/photo-1579782582043-7ef349020d2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      category: "Art",
      inventory: 50,
    });
    
    this.createProduct({
      name: "Immersify Water Bottle",
      slug: "immersify-water-bottle",
      description: "Stay hydrated during your immersive adventures with our stainless steel water bottle.",
      price: 22,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      category: "Accessories",
      inventory: 75,
    });

    // Create availability slots for the next 30 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const venues = [nycVenue, laVenue, chicagoVenue];
    const experienceIds = [cosmicPlayground.id, digitalForest.id, dreamMachine.id, gravityDefier.id];
    
    for (const venue of venues) {
      const venueExperiences = Array.from(this.venueExperiences.values())
        .filter(ve => ve.venueId === venue.id)
        .map(ve => ve.experienceId);
      
      for (const experienceId of venueExperiences) {
        // Create slots for each day
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          
          // Create several time slots for each day
          const timeSlots = ['10:00:00', '11:30:00', '13:00:00', '14:30:00', '16:00:00', '17:30:00', '19:00:00'];
          
          for (const timeSlot of timeSlots) {
            this.createAvailabilitySlot({
              venueId: venue.id,
              experienceId: experienceId,
              date: dateString,
              time: timeSlot,
              capacity: 20,
              bookedCount: Math.floor(Math.random() * 10), // Random booking count
            });
          }
        }
      }
    }
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Experience Methods
  async getAllExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async getExperienceBySlug(slug: string): Promise<Experience | undefined> {
    return Array.from(this.experiences.values()).find(
      (experience) => experience.slug === slug
    );
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.experienceIdCounter++;
    const now = new Date();
    const experience: Experience = { ...insertExperience, id, createdAt: now };
    this.experiences.set(id, experience);
    return experience;
  }

  async updateExperience(id: number, experienceData: Partial<Experience>): Promise<Experience | undefined> {
    const experience = this.experiences.get(id);
    if (!experience) return undefined;
    
    const updatedExperience = { ...experience, ...experienceData };
    this.experiences.set(id, updatedExperience);
    return updatedExperience;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Venue Methods
  async getAllVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenueBySlug(slug: string): Promise<Venue | undefined> {
    return Array.from(this.venues.values()).find(
      (venue) => venue.slug === slug
    );
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = this.venueIdCounter++;
    const now = new Date();
    const venue: Venue = { ...insertVenue, id, createdAt: now };
    this.venues.set(id, venue);
    return venue;
  }

  async updateVenue(id: number, venueData: Partial<Venue>): Promise<Venue | undefined> {
    const venue = this.venues.get(id);
    if (!venue) return undefined;
    
    const updatedVenue = { ...venue, ...venueData };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async getVenueExperiences(venueId: number): Promise<Experience[]> {
    const venueExperiencesList = Array.from(this.venueExperiences.values())
      .filter(ve => ve.venueId === venueId);
    
    const experienceIds = venueExperiencesList.map(ve => ve.experienceId);
    return Array.from(this.experiences.values())
      .filter(exp => experienceIds.includes(exp.id));
  }

  // Venue Experience Methods
  async createVenueExperience(insertVenueExperience: InsertVenueExperience): Promise<VenueExperience> {
    const id = this.venueExperienceIdCounter++;
    const venueExperience: VenueExperience = { ...insertVenueExperience, id };
    this.venueExperiences.set(id, venueExperience);
    return venueExperience;
  }

  async getVenueExperiencesByVenueId(venueId: number): Promise<VenueExperience[]> {
    return Array.from(this.venueExperiences.values())
      .filter(ve => ve.venueId === venueId);
  }

  async getVenueExperiencesByExperienceId(experienceId: number): Promise<VenueExperience[]> {
    return Array.from(this.venueExperiences.values())
      .filter(ve => ve.experienceId === experienceId);
  }

  // Availability Slot Methods
  async getAvailabilitySlots(venueId: number, experienceId: number, date: string): Promise<AvailabilitySlot[]> {
    return Array.from(this.availabilitySlots.values())
      .filter(slot => 
        slot.venueId === venueId && 
        slot.experienceId === experienceId && 
        slot.date === date
      );
  }

  async createAvailabilitySlot(insertSlot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const id = this.availabilitySlotIdCounter++;
    const slot: AvailabilitySlot = { ...insertSlot, id };
    this.availabilitySlots.set(id, slot);
    return slot;
  }

  async updateAvailabilitySlot(id: number, slotData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot | undefined> {
    const slot = this.availabilitySlots.get(id);
    if (!slot) return undefined;
    
    const updatedSlot = { ...slot, ...slotData };
    this.availabilitySlots.set(id, updatedSlot);
    return updatedSlot;
  }

  // Booking Methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt: now };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...bookingData };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Product Methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const product: Product = { ...insertProduct, id, createdAt: now };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart Methods
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => 
        (userId && item.userId === userId) || 
        (sessionId && item.sessionId === sessionId)
      );
  }

  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const now = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt: now };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    if (!userId && !sessionId) return false;
    
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => 
        (userId && item.userId === userId) || 
        (sessionId && item.sessionId === sessionId)
      );
    
    for (const item of itemsToRemove) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  // Membership Tier Methods
  async getAllMembershipTiers(): Promise<MembershipTier[]> {
    return Array.from(this.membershipTiers.values());
  }

  async getMembershipTier(id: number): Promise<MembershipTier | undefined> {
    return this.membershipTiers.get(id);
  }

  async getMembershipTierByName(name: string): Promise<MembershipTier | undefined> {
    return Array.from(this.membershipTiers.values()).find(
      (tier) => tier.name.toLowerCase() === name.toLowerCase()
    );
  }

  async createMembershipTier(insertTier: InsertMembershipTier): Promise<MembershipTier> {
    const id = this.membershipTierIdCounter++;
    const tier: MembershipTier = { ...insertTier, id };
    this.membershipTiers.set(id, tier);
    return tier;
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Experiences
  async getAllExperiences(): Promise<Experience[]> {
    return db.select().from(experiences);
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience || undefined;
  }

  async getExperienceBySlug(slug: string): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.slug, slug));
    return experience || undefined;
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const [newExperience] = await db
      .insert(experiences)
      .values(experience)
      .returning();
    return newExperience;
  }

  async updateExperience(id: number, experienceData: Partial<Experience>): Promise<Experience | undefined> {
    const [updatedExperience] = await db
      .update(experiences)
      .set(experienceData)
      .where(eq(experiences.id, id))
      .returning();
    return updatedExperience;
  }

  async deleteExperience(id: number): Promise<boolean> {
    const result = await db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();
    return result.length > 0;
  }

  // Venues
  async getAllVenues(): Promise<Venue[]> {
    return db.select().from(venues);
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue || undefined;
  }

  async getVenueBySlug(slug: string): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.slug, slug));
    return venue || undefined;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [newVenue] = await db
      .insert(venues)
      .values(venue)
      .returning();
    return newVenue;
  }

  async updateVenue(id: number, venueData: Partial<Venue>): Promise<Venue | undefined> {
    const [updatedVenue] = await db
      .update(venues)
      .set(venueData)
      .where(eq(venues.id, id))
      .returning();
    return updatedVenue;
  }

  async getVenueExperiences(venueId: number): Promise<Experience[]> {
    try {
      console.log(`Getting experiences for venue ID: ${venueId}`);
      const venueExperiencesList = await db
        .select()
        .from(venueExperiences)
        .where(eq(venueExperiences.venue_id, venueId));

      console.log(`Found ${venueExperiencesList.length} venue-experience mappings for venue ID ${venueId}`);
      
      if (venueExperiencesList.length === 0) {
        return [];
      }

      const experienceIds = venueExperiencesList.map(ve => ve.experience_id);
      console.log(`Experience IDs to fetch: ${experienceIds.join(', ')}`);
      
      const result = await db
        .select()
        .from(experiences)
        .where(inArray(experiences.id, experienceIds));
        
      console.log(`Retrieved ${result.length} experiences`);
      return result;
    } catch (error) {
      console.error('Error in getVenueExperiences:', error);
      return [];
    }
  }

  // Venue Experiences
  async createVenueExperience(venueExperience: InsertVenueExperience): Promise<VenueExperience> {
    const [newVenueExperience] = await db
      .insert(venueExperiences)
      .values(venueExperience)
      .returning();
    return newVenueExperience;
  }

  async getVenueExperiencesByVenueId(venueId: number): Promise<VenueExperience[]> {
    return db
      .select()
      .from(venueExperiences)
      .where(eq(venueExperiences.venue_id, venueId));
  }

  async getVenueExperiencesByExperienceId(experienceId: number): Promise<VenueExperience[]> {
    return db
      .select()
      .from(venueExperiences)
      .where(eq(venueExperiences.experience_id, experienceId));
  }

  // Availability Slots
  async getAvailabilitySlots(venueId: number, experienceId: number, date: string): Promise<AvailabilitySlot[]> {
    return db
      .select()
      .from(availabilitySlots)
      .where(
        and(
          eq(availabilitySlots.venueId, venueId),
          eq(availabilitySlots.experienceId, experienceId),
          eq(availabilitySlots.date, date)
        )
      );
  }

  async createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const [newSlot] = await db
      .insert(availabilitySlots)
      .values(slot)
      .returning();
    return newSlot;
  }

  async updateAvailabilitySlot(id: number, slotData: Partial<AvailabilitySlot>): Promise<AvailabilitySlot | undefined> {
    const [updatedSlot] = await db
      .update(availabilitySlots)
      .set(slotData)
      .where(eq(availabilitySlots.id, id))
      .returning();
    return updatedSlot;
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId));
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(bookingData)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Cart Items
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    if (userId) {
      return db
        .select()
        .from(cartItems)
        .where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      return db
        .select()
        .from(cartItems)
        .where(eq(cartItems.sessionId, sessionId));
    }
    return [];
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const [newCartItem] = await db
      .insert(cartItems)
      .values(cartItem)
      .returning();
    return newCartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedCartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await db
      .delete(cartItems)
      .where(eq(cartItems.id, id))
      .returning();
    return result.length > 0;
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    if (userId) {
      const result = await db
        .delete(cartItems)
        .where(eq(cartItems.userId, userId))
        .returning();
      return result.length > 0;
    } else if (sessionId) {
      const result = await db
        .delete(cartItems)
        .where(eq(cartItems.sessionId, sessionId))
        .returning();
      return result.length > 0;
    }
    return false;
  }

  // Membership Tiers
  async getAllMembershipTiers(): Promise<MembershipTier[]> {
    return db.select().from(membershipTiers);
  }

  async getMembershipTier(id: number): Promise<MembershipTier | undefined> {
    const [tier] = await db
      .select()
      .from(membershipTiers)
      .where(eq(membershipTiers.id, id));
    return tier || undefined;
  }

  async getMembershipTierByName(name: string): Promise<MembershipTier | undefined> {
    const [tier] = await db
      .select()
      .from(membershipTiers)
      .where(eq(membershipTiers.name, name));
    return tier || undefined;
  }

  async createMembershipTier(tier: InsertMembershipTier): Promise<MembershipTier> {
    const [newTier] = await db
      .insert(membershipTiers)
      .values(tier)
      .returning();
    return newTier;
  }
}

// Use DatabaseStorage instead of MemStorage to persist data in Postgres
export const storage = new DatabaseStorage();

// Initialize some test data if needed
async function initializeTestData() {
  try {
    console.log("Checking if database needs sample data...");
    const experiences = await storage.getAllExperiences();
    const allVenueExperiences = await db.select().from(venueExperiences);
    
    console.log(`Found ${experiences.length} experiences and ${allVenueExperiences.length} venue-experience relationships`);
    
    // We need at least 5 experiences and 9 venue-experience relationships (3 venues × 3 experiences)
    if (experiences.length < 5 || allVenueExperiences.length < 9) {
      console.log("Adding more sample data...");
      
      // Add membership tiers if they don't exist
      const tiers = await storage.getAllMembershipTiers();
      if (tiers.length === 0) {
        await storage.createMembershipTier({
          name: "Silver",
          description: "Perfect for occasional visitors",
          monthlyPrice: 19,
          discountPercentage: 10,
          priorityBookingHours: 24,
          guestPasses: 0,
          featuredTier: false
        });
        
        await storage.createMembershipTier({
          name: "Gold",
          description: "Best value for regular visitors",
          monthlyPrice: 39,
          discountPercentage: 20,
          priorityBookingHours: 48,
          guestPasses: 2,
          featuredTier: true
        });
        
        await storage.createMembershipTier({
          name: "Platinum",
          description: "Premium access for enthusiasts",
          monthlyPrice: 59,
          discountPercentage: 30,
          priorityBookingHours: 72,
          guestPasses: 4,
          featuredTier: false
        });
      }
      
      // Create venues if they don't exist
      const venues = await storage.getAllVenues();
      let nycVenue = venues.find(v => v.slug === "nyc");
      let laVenue = venues.find(v => v.slug === "la");
      let chicagoVenue = venues.find(v => v.slug === "chicago");
      
      if (!nycVenue) {
        nycVenue = await storage.createVenue({
          name: "New York City",
          slug: "nyc",
          address: "285 W Broadway",
          city: "New York",
          state: "NY",
          zipCode: "10013",
          description: "Located in the heart of Manhattan, our NYC venue spans 3 floors with 12 unique experience rooms.",
          imageUrl: "https://images.unsplash.com/photo-1582747448797-c78208e676c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isNew: false
        });
      }
      
      if (!laVenue) {
        laVenue = await storage.createVenue({
          name: "Los Angeles",
          slug: "la",
          address: "8024 Melrose Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90046",
          description: "Our LA location offers cutting-edge immersive experiences in a 15,000 sq ft warehouse converted into a technological wonderland.",
          imageUrl: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isNew: true
        });
      }
      
      if (!chicagoVenue) {
        chicagoVenue = await storage.createVenue({
          name: "Chicago",
          slug: "chicago",
          address: "401 N Franklin St",
          city: "Chicago",
          state: "IL",
          zipCode: "60654",
          description: "Our Chicago venue combines industrial architecture with futuristic design to create a uniquely immersive atmosphere.",
          imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isNew: false
        });
      }
      
      // Create experiences if needed
      let cosmicExperience = experiences.find(e => e.slug === "cosmic-playground");
      let jurassicExperience = experiences.find(e => e.slug === "jurassic-ride");
      let oceanExperience = experiences.find(e => e.slug === "deep-ocean-odyssey");
      let medusaExperience = experiences.find(e => e.slug === "medusa-trial");
      let spaceExperience = experiences.find(e => e.slug === "space-station-rescue");
      
      if (!cosmicExperience) {
        cosmicExperience = await storage.createExperience({
          name: "Cosmic Playground",
          slug: "cosmic-playground",
          description: "Enter a world where physics doesn't exist, and create your own cosmic sculptures using cutting-edge technology that responds to your movements and thoughts.",
          shortDescription: "Enter a world where physics doesn't exist, and create your own cosmic sculptures.",
          duration: 60,
          price: 32,
          minAge: 0,
          maxAge: 100,
          requirements: "None",
          specialEquipment: "No special equipment",
          imageUrl: "https://images.unsplash.com/photo-1576239319969-84afb35af6b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isPopular: true,
          isNew: false,
          licenseInfo: "Licensed by Cosmic Innovations Inc.",
          galleryImages: []
        });
      }
      
      if (!jurassicExperience) {
        jurassicExperience = await storage.createExperience({
          name: "Jurassic Ride",
          slug: "jurassic-ride",
          description: "Travel back 65 million years to witness dinosaurs in their natural habitat. This multi-sensory experience combines visual effects, physical sensations, and realistic sound design to create the ultimate prehistoric adventure.",
          shortDescription: "Travel back 65 million years to witness dinosaurs in their natural habitat.",
          duration: 45,
          price: 39,
          minAge: 8,
          maxAge: 100,
          requirements: "Not recommended for those with motion sickness or heart conditions",
          specialEquipment: "All equipment provided",
          imageUrl: "https://images.unsplash.com/photo-1525877442103-5ddb2089b2bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isPopular: true,
          isNew: false,
          licenseInfo: "Licensed by Holozoo Inc.",
          licenseOwner: "Holozoo Inc.",
          category: "Adventure",
          tags: ["dinosaurs", "prehistoric", "adventure"],
          galleryImages: []
        });
      }
      
      if (!oceanExperience) {
        oceanExperience = await storage.createExperience({
          name: "Deep Ocean Odyssey",
          slug: "deep-ocean-odyssey",
          description: "Descend to the darkest depths of the ocean in a groundbreaking experience that simulates a deep-sea expedition. Encounter bioluminescent creatures, underwater volcanoes, and marine life never seen by human eyes.",
          shortDescription: "Descend to the darkest depths of the ocean in a groundbreaking experience.",
          duration: 50,
          price: 35,
          minAge: 6,
          maxAge: 100,
          requirements: "None",
          specialEquipment: "All equipment provided",
          imageUrl: "https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isPopular: false,
          isNew: true,
          licenseInfo: "Licensed by OceanVR Ltd.",
          licenseOwner: "OceanVR Ltd.",
          category: "Education",
          tags: ["ocean", "marine", "education"],
          galleryImages: []
        });
      }
      
      if (!medusaExperience) {
        medusaExperience = await storage.createExperience({
          name: "Medusa Trial",
          slug: "medusa-trial",
          description: "Step into Greek mythology as you navigate the labyrinth of the Medusa. Using advanced haptic technology, you'll feel the cold stone as your companions are turned to stone around you. Can you defeat the Medusa without looking at her?",
          shortDescription: "Step into Greek mythology as you navigate the labyrinth of the Medusa.",
          duration: 40,
          price: 29,
          minAge: 12,
          maxAge: 100,
          requirements: "Not recommended for those with claustrophobia",
          specialEquipment: "All equipment provided",
          imageUrl: "https://images.unsplash.com/photo-1608506375591-b90e055d9eec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isPopular: false,
          isNew: false,
          licenseInfo: "Licensed by BlackSwan Guru LLC",
          licenseOwner: "BlackSwan Guru LLC",
          category: "Mythology",
          tags: ["greek", "mythology", "puzzle"],
          galleryImages: []
        });
      }
      
      if (!spaceExperience) {
        spaceExperience = await storage.createExperience({
          name: "Space Station Rescue",
          slug: "space-station-rescue",
          description: "A team-based experience where you and your crew must work together to repair a critically damaged space station. Solve complex puzzles, perform spacewalks, and navigate zero-gravity environments to save the day.",
          shortDescription: "Work together to repair a critically damaged space station.",
          duration: 75,
          price: 45,
          minAge: 14,
          maxAge: 100,
          requirements: "Teamwork required, 4-6 participants",
          specialEquipment: "All equipment provided",
          imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          isPopular: true,
          isNew: true,
          licenseInfo: "Licensed by Orbital Entertainment",
          licenseOwner: "Orbital Entertainment",
          category: "Team",
          tags: ["space", "teamwork", "puzzle"],
          galleryImages: []
        });
      }
      
      // Define venue-experience mappings
      const venueExperienceMappings = [
        // NYC Venue Experiences
        { venueId: nycVenue.id, experienceId: cosmicExperience.id, isExclusive: false },
        { venueId: nycVenue.id, experienceId: jurassicExperience.id, isExclusive: false },
        { venueId: nycVenue.id, experienceId: medusaExperience.id, isExclusive: false },
        
        // LA Venue Experiences
        { venueId: laVenue.id, experienceId: cosmicExperience.id, isExclusive: false },
        { venueId: laVenue.id, experienceId: oceanExperience.id, isExclusive: true },
        { venueId: laVenue.id, experienceId: spaceExperience.id, isExclusive: false },
        
        // Chicago Venue Experiences
        { venueId: chicagoVenue.id, experienceId: jurassicExperience.id, isExclusive: false },
        { venueId: chicagoVenue.id, experienceId: medusaExperience.id, isExclusive: false },
        { venueId: chicagoVenue.id, experienceId: spaceExperience.id, isExclusive: false }
      ];
      
      // Link experiences to venues if needed
      const existingVenueExperiences = await db.select().from(venueExperiences);
      console.log(`Found ${existingVenueExperiences.length} existing venue-experience relationships`);
      
      // Create venue-experience connections if they don't exist
      for (const mapping of venueExperienceMappings) {
        const exists = existingVenueExperiences.some(ve => 
          ve.venueId === mapping.venueId && ve.experienceId === mapping.experienceId
        );
        
        if (!exists) {
          console.log(`Creating venue-experience relationship: Venue ID ${mapping.venueId} with Experience ID ${mapping.experienceId}`);
          await storage.createVenueExperience({
            venueId: mapping.venueId,
            experienceId: mapping.experienceId,
            isExclusive: mapping.isExclusive
          });
        }
      }
      
      // Add availability slots for each venue-experience combination
      // Today
      const today = new Date();
      const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // Tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      
      // Day after tomorrow
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      const formattedDayAfter = `${dayAfter.getFullYear()}-${String(dayAfter.getMonth() + 1).padStart(2, '0')}-${String(dayAfter.getDate()).padStart(2, '0')}`;
      
      // NYC venue slots
      await addAvailabilitySlotsIfNotExist(nycVenue.id, cosmicExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      await addAvailabilitySlotsIfNotExist(nycVenue.id, jurassicExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      await addAvailabilitySlotsIfNotExist(nycVenue.id, medusaExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      
      // LA venue slots
      await addAvailabilitySlotsIfNotExist(laVenue.id, cosmicExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      await addAvailabilitySlotsIfNotExist(laVenue.id, oceanExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      await addAvailabilitySlotsIfNotExist(laVenue.id, spaceExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      
      // Chicago venue slots
      await addAvailabilitySlotsIfNotExist(chicagoVenue.id, jurassicExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      await addAvailabilitySlotsIfNotExist(chicagoVenue.id, medusaExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      await addAvailabilitySlotsIfNotExist(chicagoVenue.id, spaceExperience.id, [formattedToday, formattedTomorrow, formattedDayAfter]);
      
      // Add products for merchandise
      const products = await storage.getAllProducts();
      if (products.length === 0) {
        await storage.createProduct({
          name: "Immersify T-Shirt",
          slug: "immersify-tshirt",
          description: "Premium quality cotton t-shirt with the Immersify logo. Available in multiple sizes.",
          price: 24.99,
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          category: "Apparel",
          inventory: 100
        });
        
        await storage.createProduct({
          name: "Cosmic Playground Poster",
          slug: "cosmic-playground-poster",
          description: "Limited edition 18\"x24\" poster featuring artwork from the Cosmic Playground experience.",
          price: 19.99,
          imageUrl: "https://images.unsplash.com/photo-1579541591970-e5cf1313777f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          category: "Art",
          inventory: 50
        });
        
        await storage.createProduct({
          name: "Jurassic Ride Action Figure Set",
          slug: "jurassic-ride-figures",
          description: "Set of 5 detailed dinosaur figures from the Jurassic Ride experience. Perfect for collectors!",
          price: 34.99,
          imageUrl: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          category: "Toys",
          inventory: 75
        });
        
        await storage.createProduct({
          name: "Deep Ocean Water Bottle",
          slug: "deep-ocean-bottle",
          description: "Stainless steel water bottle featuring artwork inspired by the Deep Ocean Odyssey experience.",
          price: 29.99,
          imageUrl: "https://images.unsplash.com/photo-1625708458528-822a6c49fc00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          category: "Accessories",
          inventory: 60
        });
        
        await storage.createProduct({
          name: "Medusa Trial Puzzle",
          slug: "medusa-puzzle",
          description: "1000-piece jigsaw puzzle featuring the intricate labyrinth from the Medusa Trial experience.",
          price: 27.99,
          imageUrl: "https://images.unsplash.com/photo-1595531172949-29a7dd4f30c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          category: "Games",
          inventory: 40
        });
      }
      
      console.log("Sample data initialization complete.");
    } else {
      console.log("Database already has adequate data. Skipping initialization.");
    }
  } catch (error) {
    console.error("Error initializing test data:", error);
  }
}

// Helper function to add availability slots if they don't exist
async function addAvailabilitySlotsIfNotExist(venueId: number, experienceId: number, dates: string[]) {
  const times = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
  
  for (const date of dates) {
    for (const time of times) {
      const existingSlots = await storage.getAvailabilitySlots(venueId, experienceId, date);
      const slotExists = existingSlots.some(slot => slot.time === time);
      
      if (!slotExists) {
        await storage.createAvailabilitySlot({
          venueId,
          experienceId,
          date,
          time,
          capacity: 20,
          bookedCount: 0
        });
      }
    }
  }
}

// Initialize test data when the app starts
initializeTestData();
