import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// Create Inngest client
export const inngest = new Inngest({ id: "Whatsup" });

// Function: Sync user when created
const syncUser = inngest.createFunction(
  { name: "Sync User" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB(); // ensure DB connection

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address || "", // fallback if undefined
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
    };

    await User.create(newUser);

await upsertStreamUser({
  id: newUser.clerkId.toString(),
  name: newUser.name,
  image: newUser.image,
});
  }
);

// Function: Delete user when deleted
const deleteUserFromDb = inngest.createFunction(
  { id: "delete-User-From-Db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

// Export functions for Express / Vercel serverless
export const functions = [syncUser, deleteUserFromDb];    
