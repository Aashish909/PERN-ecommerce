import database from "../database/db.js";

const fixIphone = async () => {
    try {
        console.log("🛠️ Fixing 'Iphone se 2'...");

        // 1. Find the product
        const result = await database.query(
            "SELECT * FROM products WHERE name ILIKE '%Iphone se 2%'"
        );

        if (result.rows.length === 0) {
            console.log("❌ Product not found!");
            process.exit(1);
        }

        const product = result.rows[0];
        console.log(`Found product: ${product.name} (Category: ${product.category})`);

        // 2. Update Category and Image
        const newCategory = "Electronics";
        const newImage = [{
            public_id: "placeholder_iphone",
            url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" // Generic phone image
        }];

        await database.query(
            `UPDATE products 
       SET category = $1, images = $2 
       WHERE id = $3`,
            [newCategory, JSON.stringify(newImage), product.id]
        );

        console.log(`✅ Updated product '${product.name}':`);
        console.log(`   - Category: ${newCategory}`);
        console.log(`   - Image: Set to placeholder`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error fixing product:", error);
        process.exit(1);
    }
};

fixIphone();
