/**
 * Seed script — creates admin user from ADMIN_EMAIL env var
 * Run: npx tsx scripts/seed-admin.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!uri) { console.error("❌ MONGODB_URI not set"); process.exit(1); }
  if (!adminEmail) { console.error("❌ ADMIN_EMAIL not set"); process.exit(1); }

  await mongoose.connect(uri);
  const db = mongoose.connection.db!;

  const result = await db.collection("users").updateOne(
    { email: adminEmail.toLowerCase() },
    { $set: { role: "admin" } }
  );

  if (result.matchedCount === 0) {
    console.error(`❌ No user found with email: ${adminEmail}`);
    console.log("Register the account first, then run this script.");
  } else {
    console.log(`✅ Admin role granted to: ${adminEmail}`);
  }

  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
