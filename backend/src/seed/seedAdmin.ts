import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    await connectDB();
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Admin created");
    }
  } catch (error) {
    console.log(error);
  }
};

seedAdmin();
