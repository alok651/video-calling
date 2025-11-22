import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

// Create Inngest client
export const inngest = new Inngest({ 
  id: "whatsup", // ✅ CHANGE 1: "Whatsup" → "whatsup" (lowercase)
  name: "Whatsup App" // ✅ OPTIONAL: Display name add kiya
});

// Function: Sync user when created
export const syncUser = inngest.createFunction( // ✅ CHANGE 2: const → export const
  { 
    id: "sync-user", // ✅ CHANGE 3: id property add ki
    name: "Sync User" 
  },
  { event: "clerk/user.created" },
  async ({ event, step }) => { // ✅ CHANGE 4: step parameter add kiya
    // ✅ CHANGE 5: Steps mein wrap kiya (better error handling)
    await step.run("connect-db", async () => {
      await connectDB();
    });

    await step.run("create-user", async () => {
      const { id, email_addresses, first_name: firstName, last_name: lastName, image_url } = event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        name: `${(firstName || "")} ${(lastName || "")}`.trim(), // use template literal and trim
        image: image_url,
      };

      await User.create(newUser);
    });
  }
);

// Function: Delete user when deleted
export const deleteUserFromDb = inngest.createFunction( // ✅ CHANGE 6: const → export const
  { 
    id: "delete-user-from-db", // ✅ CHANGE 7: "delete-User-From-Db" → "delete-user-from-db"
    name: "Delete User From DB" 
  },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => { // ✅ CHANGE 8: step parameter add kiya
    // ✅ CHANGE 9: Steps mein wrap kiya
    await step.run("connect-db", async () => {
      await connectDB();
    });

    await step.run("delete-user", async () => {
      const { id } = event.data;
      await User.deleteOne({ clerkId: id });
    });
  }
);

// Export functions for Express / Vercel serverless
export const functions = [syncUser, deleteUserFromDb];