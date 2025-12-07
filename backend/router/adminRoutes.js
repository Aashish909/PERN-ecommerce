import express from "express";
import {
  dashboardStats,
  deleteUser,
  getAllUsers,
  getRecentOrders,
  getStockOutProducts,
  getCustomerStats
} from "../controllers/adminController.js";
import {
  isAuthenticated,
  authorizedRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/getallusers",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers
); //DASHBOARD

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteUser
);

router.get(
  "/fetch/dashboard-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats
);

router.get(
  "/fetch/recent-orders",
  isAuthenticated,
  authorizedRoles("Admin"),
  getRecentOrders
);

router.get(
  "/fetch/stock-out-products",
  isAuthenticated,
  authorizedRoles("Admin"),
  getStockOutProducts
);

router.get(
  "/fetch/customer-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  getCustomerStats
);

export default router;
