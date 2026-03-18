import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config({ path: '../.env' }); // Assuming .env is located correctly

const adminId = "69ba8b2a548b5a5720438411";

const sysAdminUser = {
  _id: new mongoose.Types.ObjectId(adminId),
  username: "rohan",
  email: "test@example.com",
  password: "$2a$10$bva3ulEDzy5ueZZK/hPYb.v1NQI6Jgv7BRMGWWTkeSHuKx9Lfdcc.",
  address: "Aazad Nagar, Brahmand, Thane West, 400607",
  phone: "1234567890",
  avatar: "https://firebasestorage.googleapis.com/v0/b/mern-travel-tourism.appspot.com/o/profile-photos%2F1706415975072defaultProfileImgttms125.png?alt=media",
  user_role: 1, // 1 specifies Admin privileges
};

const bootstrapDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ Fatal Error: MONGO_URI not found in environment variables.");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected securely to MongoDB Atlas.");

    // Proper Seeding: Only Upsert the crucial System Admin to guarantee platform access.
    // We intentionally DO NOT seed dummy packages, bookings, or reviews here to maintain 
    // real-world production database integrity.
    
    console.log("Initiating System Admin verification...");
    const result = await User.updateOne(
      { _id: sysAdminUser._id }, 
      { $set: sysAdminUser }, 
      { upsert: true }
    );
    
    if (result.matchedCount > 0) {
       console.log("ℹ️ Default Admin (rohan) was already present and has been updated securely.");
    } else {
       console.log("✅ Default Admin (rohan) successfully seeded!");
    }

    console.log("🚀 Initial Proper Database Bootstrap completely successful!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Bootstrap failed with error:", error);
    process.exit(1);
  }
};

bootstrapDatabase();
