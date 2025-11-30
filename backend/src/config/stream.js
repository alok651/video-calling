import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const StreamClient = StreamChat.getInstance(
  ENV.STREAM_API_KEY,
  ENV.STREAM_API_SECRET
);

export const upsertStreamUser = async (userData) => {
  try {
    await StreamClient.upsertUser(userData);
    console.log("Stream user upserted successfully", userData.name);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await StreamClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
  } catch (error) {
    console.error("Error deleting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdString = userId.toString();
    return StreamClient.createToken(userIdString);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    return null;
  }
};

export const addUserToPublicChannel = async (userId) => {
  const publicChannels = await StreamClient.queryChannels({
    discoverable: true,
  });
  for (const channel of publicChannels) {
    await channel.addMembers([userId]);
  }
};