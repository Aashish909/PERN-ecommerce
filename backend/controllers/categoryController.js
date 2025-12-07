import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { v2 as cloudinary } from 'cloudinary';
import database from "../database/db.js";

// Create categories table if it doesn't exist
export const initCategoriesTable = async () => {
    try {
        await database.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        icon JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("Categories table initialized");
    } catch (error) {
        console.error("Error initializing categories table:", error);
    }
};

// Create Category
export const createCategory = catchAsyncErrors(async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return next(new ErrorHandler("Please provide category name.", 400));
    }

    // Check if category already exists
    const existing = await database.query(
        "SELECT * FROM categories WHERE name = $1",
        [name]
    );

    if (existing.rows.length > 0) {
        return next(new ErrorHandler("Category already exists.", 400));
    }

    let iconData = null;
    if (req.files && req.files.icon) {
        const icon = req.files.icon;
        const result = await cloudinary.uploader.upload(icon.tempFilePath, {
            folder: "PERN-Ecommerce_Category_Icons",
            width: 200,
            height: 200,
            crop: "fill",
        });

        iconData = {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }

    const category = await database.query(
        `INSERT INTO categories (name, icon) VALUES ($1, $2) RETURNING *`,
        [name, JSON.stringify(iconData)]
    );

    res.status(201).json({
        success: true,
        message: "Category created successfully.",
        category: category.rows[0],
    });
});

// Get All Categories with Product Counts
export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
    const result = await database.query(`
    SELECT 
      c.*,
      COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category = c.name
    GROUP BY c.id
    ORDER BY product_count DESC, c.name ASC
  `);

    res.status(200).json({
        success: true,
        categories: result.rows,
    });
});

// Update Category
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
        return next(new ErrorHandler("Please provide category name.", 400));
    }

    const category = await database.query(
        "SELECT * FROM categories WHERE id = $1",
        [categoryId]
    );

    if (category.rows.length === 0) {
        return next(new ErrorHandler("Category not found.", 404));
    }

    let iconData = category.rows[0].icon;

    if (req.files && req.files.icon) {
        // Delete old icon from cloudinary
        if (iconData && iconData.public_id) {
            try {
                await cloudinary.uploader.destroy(iconData.public_id);
            } catch (error) {
                console.error("Error deleting old icon:", error);
            }
        }

        // Upload new icon
        const icon = req.files.icon;
        const result = await cloudinary.uploader.upload(icon.tempFilePath, {
            folder: "PERN-Ecommerce_Category_Icons",
            width: 200,
            height: 200,
            crop: "fill",
        });

        iconData = {
            url: result.secure_url,
            public_id: result.public_id,
        };
    }

    const result = await database.query(
        `UPDATE categories SET name = $1, icon = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
        [name, JSON.stringify(iconData), categoryId]
    );

    // Update product categories if name changed
    if (category.rows[0].name !== name) {
        await database.query(
            `UPDATE products SET category = $1 WHERE category = $2`,
            [name, category.rows[0].name]
        );
    }

    res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        category: result.rows[0],
    });
});

// Delete Category
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const { categoryId } = req.params;

    const category = await database.query(
        "SELECT * FROM categories WHERE id = $1",
        [categoryId]
    );

    if (category.rows.length === 0) {
        return next(new ErrorHandler("Category not found.", 404));
    }

    // Check if category has products
    const productsCount = await database.query(
        "SELECT COUNT(*) FROM products WHERE category = $1",
        [category.rows[0].name]
    );

    if (parseInt(productsCount.rows[0].count) > 0) {
        return next(
            new ErrorHandler(
                "Cannot delete category with existing products. Please reassign or delete products first.",
                400
            )
        );
    }

    // Delete icon from cloudinary
    const iconData = category.rows[0].icon;
    if (iconData && iconData.public_id) {
        try {
            await cloudinary.uploader.destroy(iconData.public_id);
        } catch (error) {
            console.error("Error deleting icon:", error);
        }
    }

    await database.query("DELETE FROM categories WHERE id = $1", [categoryId]);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
    });
});

// Get Category Stats
export const getCategoryStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await database.query(`
    SELECT 
      COUNT(DISTINCT c.id) as total_categories,
      COUNT(p.id) as total_products,
      c.name as largest_category,
      COUNT(p.id) as largest_category_count
    FROM categories c
    LEFT JOIN products p ON p.category = c.name
    GROUP BY c.id, c.name
    ORDER BY COUNT(p.id) DESC
    LIMIT 1
  `);

    const totalCategoriesResult = await database.query(
        "SELECT COUNT(*) as count FROM categories"
    );

    const totalProductsResult = await database.query(
        "SELECT COUNT(*) as count FROM products"
    );

    res.status(200).json({
        success: true,
        stats: {
            totalCategories: parseInt(totalCategoriesResult.rows[0].count),
            totalProducts: parseInt(totalProductsResult.rows[0].count),
            largestCategory: stats.rows[0]?.largest_category || "N/A",
            largestCategoryCount: parseInt(stats.rows[0]?.largest_category_count || 0),
        },
    });
});
