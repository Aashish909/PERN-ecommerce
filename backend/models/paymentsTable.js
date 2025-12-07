// import database from "../database/db.js";
// export async function createPaymentsTable() {
//   try {
//     const query = `
//       CREATE TABLE IF NOT EXISTS payments (
//         id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//         order_id UUID NOT NULL UNIQUE,
//         payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('Online', Cash on Delivery')),
//         payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Failed')),
//         payment_intent_id VARCHAR(255) UNIQUE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE);`;
//     await database.query(query);
//   } catch (error) {
//     console.error("❌ Failed To Create Payments Table.", error);
//     process.exit(1);
//   }
// }

import database from "../database/db.js";

export async function createPaymentsTable() {
  try {
    // 1️⃣ Create payments table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_id UUID NOT NULL UNIQUE,
        payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('Online', 'Cash on Delivery')),
        payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Failed')),         
        payment_intent_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `;
    await database.query(createTableQuery);

    // 2️⃣ Create trigger function
    const createFunctionQuery = `
      CREATE OR REPLACE FUNCTION check_cod_limit()
      RETURNS TRIGGER AS $$
      DECLARE
        amount NUMERIC;
      BEGIN
        SELECT total_price INTO amount 
        FROM orders 
        WHERE id = NEW.order_id;

        IF NEW.payment_type = 'Cash on Delivery' AND amount > 10000 THEN
          RAISE EXCEPTION '❌ Cash on Delivery is allowed only for orders up to ₹10,000';
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    await database.query(createFunctionQuery);

    // 3️⃣ Drop existing trigger if already exists
    const dropTriggerQuery = `
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_trigger 
          WHERE tgname = 'cod_limit_trigger'
        ) THEN
          DROP TRIGGER cod_limit_trigger ON payments;
        END IF;
      END $$;
    `;
    await database.query(dropTriggerQuery);

    // 4️⃣ Create trigger again
    const createTriggerQuery = `
      CREATE TRIGGER cod_limit_trigger
      BEFORE INSERT OR UPDATE ON payments
      FOR EACH ROW
      EXECUTE FUNCTION check_cod_limit();
    `;
    await database.query(createTriggerQuery);

    console.log("✅ Payments table + COD trigger created successfully");
  } catch (error) {
    console.error(
      "❌ Failed to create payments table or trigger error:",
      error
    );
    process.exit(1);
  }
}
