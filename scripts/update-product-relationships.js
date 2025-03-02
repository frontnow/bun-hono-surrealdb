// Script to update product-brand relationships in SurrealDB
import { Surreal } from "surrealdb";

// Create a connection to SurrealDB
async function connectToSurrealDB() {
  console.log("Attempting to connect to SurrealDB...");
  const db = new Surreal();

  try {
    // Connect to the SurrealDB server with namespace and database included
    await db.connect(
      "wss://product-graph-06ab59i8odvsj7v3ve16ctlcgg.aws-euw1.surreal.cloud/rpc",
      {
        namespace: "Product Graph",
        database: "Product Graph",
      }
    );

    // Authenticate with credentials
    await db.signin({
      username: "root",
      password: "VerySecurePassword!",
    });

    console.log("🔌 SurrealDB connection established");
    return db;
  } catch (error) {
    console.error("❌ SurrealDB connection error:", error);
    throw error;
  }
}

// Mapping of product names to brand IDs
const productBrandMapping = {
  "Smartphone Pro": "brands:apple",
  'Smart TV 55"': "brands:samsung",
  "Wireless Headphones": "brands:sony",
  "Refrigerator Model X": "brands:lg",
  "Power Drill": "brands:bosch",
  "Coffee Maker": "brands:bosch",
  "Tablet Pro": "brands:apple",
  "Washing Machine": "brands:samsung",
  "Bluetooth Speaker": "brands:sony",
  "Air Conditioner": "brands:lg",
  "Test": "brands:bosch", // Assuming original test product belongs to Bosch
};

// Function to update product-brand relationships
async function updateProductBrandRelationships(db) {
  console.log("Updating product-brand relationships...");

  // Get all products
  const products = await db.query(`SELECT * FROM product`);
  console.log(`Found ${products[0]?.length || 0} products`);

  if (!products[0] || products[0].length === 0) {
    console.log("No products found to update relationships for.");
    return;
  }

  for (const product of products[0]) {
    try {
      const productId = product.id;
      const productName = product.name;
      
      if (!productName || !productBrandMapping[productName]) {
        console.log(`⚠️ No brand mapping for product: ${productName}`);
        continue;
      }
      
      const brandId = productBrandMapping[productName];
      console.log(`Processing product: ${productName} (${productId}) -> ${brandId}`);
      
      // First delete any existing relationships for this product
      await db.query(`
        DELETE ->product_brand FROM ${productId}
      `);
      console.log(`  ↳ Deleted existing relationships`);
      
      // Create new relationship
      const relateResult = await db.query(`
        RELATE ${productId}->product_brand->${brandId} SET time = time::now()
      `);
      
      console.log(`  ↳ Created new relationship: ${productId} -> ${brandId}`);
      console.log(`  ↳ Relationship result:`, JSON.stringify(relateResult));
    } catch (error) {
      console.error(`❌ Error updating relationship for product ${product.name}:`, error);
      console.error(error.stack);
    }
  }
}

// Main function to run the script
async function main() {
  let db;
  try {
    db = await connectToSurrealDB();
    await updateProductBrandRelationships(db);
    console.log("✅ Product-brand relationships updated successfully!");
  } catch (error) {
    console.error("❌ Error in main execution:", error);
  } finally {
    if (db) {
      await db.close();
      console.log("🔌 SurrealDB connection closed");
    }
  }
}

// Run the script
main();