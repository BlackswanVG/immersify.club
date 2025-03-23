import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema, insertCartItemSchema, insertExperienceSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";
import { experienceImageUpload, removeImage } from "./services/upload";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/experiences", async (req: Request, res: Response) => {
    try {
      console.log("Fetching all experiences from database...");
      const experiences = await storage.getAllExperiences();
      console.log("Experiences fetched:", experiences?.length || 0);
      res.json(experiences);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.get("/api/experiences/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const experience = await storage.getExperienceBySlug(slug);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.get("/api/venues", async (req: Request, res: Response) => {
    try {
      console.log("Fetching all venues from database...");
      const venues = await storage.getAllVenues();
      console.log("Venues fetched:", venues?.length || 0);
      res.json(venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const venue = await storage.getVenueBySlug(slug);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.json(venue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue" });
    }
  });

  app.get("/api/venues/:slug/experiences", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const venue = await storage.getVenueBySlug(slug);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      const experiences = await storage.getVenueExperiences(venue.id);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue experiences" });
    }
  });

  app.get("/api/availability", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        venueId: z.string().transform(val => parseInt(val)),
        experienceId: z.string().transform(val => parseInt(val)),
        date: z.string(),
      });

      const { venueId, experienceId, date } = schema.parse(req.query);
      
      const slots = await storage.getAvailabilitySlots(venueId, experienceId, date);
      res.json(slots);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if the slot is available
      const availabilitySlots = await storage.getAvailabilitySlots(
        bookingData.venueId,
        bookingData.experienceId,
        bookingData.date
      );
      
      const slot = availabilitySlots.find(s => s.time === bookingData.time);
      
      if (!slot) {
        return res.status(404).json({ message: "Time slot not found" });
      }
      
      if (slot.bookedCount + bookingData.numberOfTickets > slot.capacity) {
        return res.status(400).json({ message: "Not enough capacity for this booking" });
      }
      
      // Update the availability slot
      await storage.updateAvailabilitySlot(slot.id, {
        bookedCount: slot.bookedCount + bookingData.numberOfTickets
      });
      
      // Create the booking
      const booking = await storage.createBooking(bookingData);
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from cookie or create a new one
      let sessionId = req.cookies?.cartSessionId;
      
      if (!sessionId) {
        sessionId = nanoid();
        res.cookie('cartSessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      }
      
      // Get user ID from session if logged in
      const userId = req.session?.userId;
      
      const cartItems = await storage.getCartItems(userId, sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from cookie or create a new one
      let sessionId = req.cookies?.cartSessionId;
      
      if (!sessionId) {
        sessionId = nanoid();
        res.cookie('cartSessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      }
      
      // Get user ID from session if logged in
      const userId = req.session?.userId;
      
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: userId || undefined,
        sessionId: userId ? undefined : sessionId,
      });
      
      const cartItem = await storage.addCartItem(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedCartItem = await storage.updateCartItem(parseInt(id), quantity);
      
      if (!updatedCartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedCartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.removeCartItem(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req: Request, res: Response) => {
    try {
      // Get session ID from cookie
      const sessionId = req.cookies?.cartSessionId;
      
      // Get user ID from session if logged in
      const userId = req.session?.userId;
      
      const success = await storage.clearCart(userId, sessionId);
      
      if (!success) {
        return res.status(400).json({ message: "No cart to clear" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  app.get("/api/membership-tiers", async (req: Request, res: Response) => {
    try {
      const tiers = await storage.getAllMembershipTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership tiers" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Create the user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "No active session" });
    }
  });

  // Image upload endpoints
  app.post("/api/upload/experience/:id", experienceImageUpload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const experienceId = parseInt(req.params.id);
      const experience = await storage.getExperience(experienceId);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      // If there's an existing image that's not a default one, remove it
      if (experience.imageUrl && experience.imageUrl.startsWith('/uploads/')) {
        await removeImage(experience.imageUrl);
      }

      // Update path to be relative to public directory for serving
      const imageUrl = `/uploads/experiences/${req.file.filename}`;
      
      // Update the experience with the new image URL
      const updatedExperience = await storage.updateExperience(experienceId, {
        imageUrl
      });
      
      res.json({
        success: true,
        imageUrl,
        experience: updatedExperience
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image", error: (error as Error).message });
    }
  });

  // Endpoint to add multiple images to an experience gallery
  app.post("/api/upload/experience/:id/gallery", experienceImageUpload.array('images', 5), async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No image files provided" });
      }

      const experienceId = parseInt(req.params.id);
      const experience = await storage.getExperience(experienceId);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      // Get uploaded image URLs
      const imageUrls = (req.files as Express.Multer.File[]).map(file => `/uploads/experiences/${file.filename}`);
      
      // Get existing gallery images or initialize empty array
      const existingGallery = experience.galleryImages || [];
      
      // Update the experience with the combined gallery images
      const updatedExperience = await storage.updateExperience(experienceId, {
        galleryImages: [...existingGallery, ...imageUrls]
      });
      
      res.json({
        success: true,
        addedImages: imageUrls,
        experience: updatedExperience
      });
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      res.status(500).json({ message: "Failed to upload gallery images", error: (error as Error).message });
    }
  });

  // Serve static files from the public directory
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    next();
  });
  app.use('/uploads', express.static('public/uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
