import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Required for Neon serverless with Node.js adapter
neonConfig.fetchConnectionCache = true;

// Create a Neon database client with the connection string
const sql = neon(process.env.DATABASE_URL!);

// Create a Drizzle instance with schema
export const db = drizzle(sql, { schema });