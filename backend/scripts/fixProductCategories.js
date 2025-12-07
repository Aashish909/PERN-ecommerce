import database from "../database/db.js";

const fixProductCategories = async () => {
    try {
        console.log("🛠️ Fixing Product Categories...");

        // 1. Get all valid categories
        const categories = await database.query("SELECT name FROM categories");
        const validCategories = categories.rows.map(c => c.name);
        console.log("Valid Categories:", validCategories);

        // 2. Get all products
        const products = await database.query("SELECT id, name, category FROM products");

        for (const product of products.rows) {
            const currentCategory = product.category;

            // Check if it matches exactly
            if (validCategories.includes(currentCategory)) {
                continue;
            }

            // Try to find a case-insensitive match
            const match = validCategories.find(c => c.toLowerCase() === currentCategory.toLowerCase());

            if (match) {
                console.log(`⚠️ Fixing mismatch: "${currentCategory}" -> "${match}" for product "${product.name}"`);
                await database.query(
                    "UPDATE products SET category = $1 WHERE id = $2",
                    [match, product.id]
                );
            } else {
                console.log(`❌ No match found for category "${currentCategory}" (Product: "${product.name}")`);
                // Optional: Set to a default category like "Electronics" or "Others" if needed
                // await database.query("UPDATE products SET category = 'Electronics' WHERE id = $1", [product.id]);
            }
        }

        console.log("✨ Product categories fixed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing product categories:", error);
        process.exit(1);
    }
};

fixProductCategories();
