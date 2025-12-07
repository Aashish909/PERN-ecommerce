// import pkg from 'pg'

// const {Client} = pkg;

// const database = new Client({
//   // user: process.env.DB_USER,
//   user: "postgres",
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   // password: process.env.DB_PASSWORD,
//   password:"12345",
//   port: process.env.DB_PORT,
// });

// try {
//   await database.connect();
//   console.log('Database connected successfully');
// } catch (error) {
//   console.error('Error connecting to database:', error);
//   process.exit(1);

// }
// export default database;

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const database = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    required: true
  }
});
// console.log("ENV Values:", {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   name: process.env.DB_NAME,
//   pass: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

try {
  await database.connect();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Error connecting to database:", error);
  process.exit(1);
}

export default database;
