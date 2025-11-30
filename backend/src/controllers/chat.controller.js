import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    // Use req.auth() as a function (new way)
    const { userId } = req.auth();
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID found" });
    }
    
    const token = generateStreamToken(userId);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error generating Stream token:", error);
    res.status(500).json({
      message: "Failed to generate Stream token",
    });
  }
};