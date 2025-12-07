import database from "../database/db.js";

export async function createUserTable() {
  try {
    const query =`
     CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL CHECK (char_length(name) >= 3),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (char_length(email) >= 3),
      password TEXT NOT NULL CHECK (char_length(password) >= 5),
      role VARCHAR(10) DEFAULT 'User' CHECK (role IN ('User', 'Admin')),
      avatar JSONB DEFAULT NULL,
      reset_password_token TEXT DEFAULT NULL,
      reset_password_expires TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
    await database.query(query);
    console.log(" User table created successfully");
  } catch (error) {
    console.error("❌ Failed To Create User Table.", error);
    process.exit(1);
  }
}