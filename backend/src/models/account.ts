import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export const AccountModel = {
  // Find a user by email
  findByEmail: async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  // Create a new user record
  create: async (data: CreateUserData) => {
    await db.insert(users).values(data);
    
    // Return sanitized user details (excluding password)
    const [newUser] = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.email, data.email));

    return newUser;
  },

  // Find user by ID
  findById: async (id: number) => {
    const [user] = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, id));
      
    return user || null;
  },
};