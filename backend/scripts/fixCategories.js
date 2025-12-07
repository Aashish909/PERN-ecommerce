import database from "../database/db.js";
import { initCategoriesTable } from "../controllers/categoryController.js";

const categories = [
    {
        name: "Electronics",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300",
    },
    {
        name: "Fashion",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300",
    },
    {
        name: "Home & Garden",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300",
    },
    {
        name: "Sports",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
    },
    {
        name: "Books",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300",
    },
    {
        name: "Beauty",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300",
    },
    {
        name: "Automotive",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300",
    },
    {
        name: "Kids & Baby",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300",
    },
];

const fixCategories = async () => {
    try {
        console.log("🛠️ Starting Category Fix...");

        // 1. Ensure table exists
        await initCategoriesTable();

        // 2. Seed Data
        console.log("🌱 Seeding categories...");
        for (const category of categories) {
            const existing = await database.query(
                "SELECT * FROM categories WHERE name = $1",
                [category.name]
            );

            if (existing.rows.length === 0) {
                const iconData = {
                    url: category.image,
                    public_id: null,
                };

                await database.query(
                    `INSERT INTO categories (name, icon) VALUES ($1, $2)`,
                    [category.name, JSON.stringify(iconData)]
                );
                console.log(`✅ Created: ${category.name}`);
            } else {
                console.log(`⏭️  Exists: ${category.name}`);
            }
        }

        console.log("✨ Category fix completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing categories:", error);
        process.exit(1);
    }
};

fixCategories();
