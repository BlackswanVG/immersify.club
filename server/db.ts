import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create a Neon database client
const sql = neon(process.env.DATABASE_URL || '');

// Create a Drizzle instance with schema
export const db = drizzle(sql, { schema });