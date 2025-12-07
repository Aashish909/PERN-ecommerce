import { createUserTable } from "../models/userTable.js";
import { createProductsTable } from "../models/productTable.js";
import { createOrdersTable } from "../models/ordersTable.js";
import { createOrderItemTable } from "../models/ordersItemsTable.js";
import { createShippingInfoTable } from "../models/shippingInfoTable.js";
import { createPaymentsTable } from "../models/paymentsTable.js";
import { createProductReviewsTable } from "../models/productReviewsTable.js";
import { initCategoriesTable } from "../controllers/categoryController.js";
import { seedCategories } from "./seedCategories.js";

export const createTables = async () => {
   try {
      await createUserTable();
      await createProductsTable();
      await createOrdersTable();
      await createOrderItemTable();
      await createShippingInfoTable();
      await createProductReviewsTable();
      await createPaymentsTable();
      await initCategoriesTable();
      await seedCategories();

      console.log("All Tables created successfully");
   } catch (error) {
      console.error("❌ Failed To Create Tables.", error);
   }
}