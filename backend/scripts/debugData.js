import database from "../database/db.js";

const debugData = async () => {
    try {
        console.log("🔍 Debugging Data...");

        // 1. Get all Categories
        const categories = await database.query("SELECT id, name FROM categories");
        console.log("\n📂 Categories in DB:");
        categories.rows.forEach(c => console.log(` - [${c.id}] "${c.name}"`));

        // 2. Get all Products
        const products = await database.query("SELECT id, name, category FROM products");
        console.log("\n📦 Products in DB:");
        products.rows.forEach(p => console.log(` - [${p.id}] "${p.name}" | Category: "${p.category}"`));

        // 3. Check for mismatches
        console.log("\n⚠️ Checking for mismatches...");
        const categoryNames = categories.rows.map(c => c.name);

        products.rows.forEach(p => {
            if (!categoryNames.includes(p.category)) {
                console.log(`❌ Mismatch found! Product "${p.name}" has category "${p.category}" which is NOT in the categories table.`);
            } else {
                console.log(`✅ Product "${p.name}" matches category "${p.category}"`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error debugging data:", error);
        process.exit(1);
    }
};

debugData();
