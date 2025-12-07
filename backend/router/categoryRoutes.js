import express from "express";
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoryStats,
} from "../controllers/categoryController.js";
import {
    authorizedRoles,
    isAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post(
    "/admin/create",
    isAuthenticated,
    authorizedRoles("Admin"),
    createCategory
);

router.put(
    "/admin/update/:categoryId",
    isAuthenticated,
    authorizedRoles("Admin"),
    updateCategory
);

router.delete(
    "/admin/delete/:categoryId",
    isAuthenticated,
    authorizedRoles("Admin"),
    deleteCategory
);

// Public routes
router.get("/", getAllCategories);
router.get("/stats", getCategoryStats);

export default router;
