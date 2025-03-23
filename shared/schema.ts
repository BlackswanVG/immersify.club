import { pgTable, text, serial, integer, boolean, timestamp, real, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  membershipTier: text("membership_tier").default("none"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: real("price").notNull(),
  minAge: integer("min_age").default(0),
  maxAge: integer("max_age").default(100),
  requirements: text("requirements"),
  specialEquipment: text("special_equipment"),
  imageUrl: text("image_url").notNull(),
  isPopular: boolean("is_popular").default(false),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  isNew: boolean("is_new").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const venueExperiences = pgTable("venue_experiences", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id").notNull(),
  experienceId: integer("experience_id").notNull(),
  isExclusive: boolean("is_exclusive").default(false),
});

export const availabilitySlots = pgTable("availability_slots", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id").notNull(),
  experienceId: integer("experience_id").notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  capacity: integer("capacity").notNull(),
  bookedCount: integer("booked_count").default(0),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  venueId: integer("venue_id").notNull(),
  experienceId: integer("experience_id").notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  numberOfTickets: integer("number_of_tickets").notNull(),
  ticketType: text("ticket_type").notNull(),
  totalPrice: real("total_price").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  inventory: integer("inventory").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  productId: integer("product_id"),
  experienceId: integer("experience_id"),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  type: text("type").notNull(), // "product" or "experience"
  createdAt: timestamp("created_at").defaultNow(),
});

// Membership tiers
export const membershipTiers = pgTable("membership_tiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  monthlyPrice: real("monthly_price").notNull(),
  description: text("description").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  priorityBookingHours: integer("priority_booking_hours").notNull(),
  guestPasses: integer("guest_passes").default(0),
  featuredTier: boolean("featured_tier").default(false),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  membershipTier: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  createdAt: true,
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
  createdAt: true,
});

export const insertVenueExperienceSchema = createInsertSchema(venueExperiences).omit({
  id: true,
});

export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertMembershipTierSchema = createInsertSchema(membershipTiers).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type VenueExperience = typeof venueExperiences.$inferSelect;
export type InsertVenueExperience = z.infer<typeof insertVenueExperienceSchema>;

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type MembershipTier = typeof membershipTiers.$inferSelect;
export type InsertMembershipTier = z.infer<typeof insertMembershipTierSchema>;
