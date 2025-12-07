import database from "../database/db.js";

const inspectProduct = async () => {
    try {
        console.log("🔍 Inspecting 'Iphone se 2'...");

        const result = await database.query(
            "SELECT * FROM products WHERE name ILIKE '%Iphone se 2%'"
        );

        if (result.rows.length === 0) {
            console.log("❌ Product not found!");
        } else {
            const product = result.rows[0];
            console.log("✅ Product Found:");
            console.log(`- ID: ${product.id}`);
            console.log(`- Name: ${product.name}`);
            console.log(`- Category: '${product.category}'`);
            console.log(`- Images:`, JSON.stringify(product.images, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error inspecting product:", error);
        process.exit(1);
    }
};

inspectProduct();
