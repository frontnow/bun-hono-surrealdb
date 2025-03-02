// Script to create product-brand relationships in SurrealDB
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

// Function to create product-brand relationships
async function createProductBrandRelationships(db) {
  console.log("Creating product-brand relationships...");

  // Get all products
  const products = await db.query(`SELECT * FROM product`);
  console.log(`Found ${products[0]?.length || 0} products`);

  if (!products[0] || products[0].length === 0) {
    console.log("No products found to create relationships for.");
    return;
  }

  // Create a direct relationship in the product record itself
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
      
      // Update the product record to include the brand reference
      const updateResult = await db.query(`
        UPDATE ${productId} 
        SET brand = ${brandId}
      `);
      
      console.log(`  ✅ Updated product with brand reference: ${productId} -> ${brandId}`);
    } catch (error) {
      console.error(`❌ Error creating relationship for product ${product.name}:`, error);
      console.error(error.stack);
    }
  }
}

// Main function to run the script
async function main() {
  let db;
  try {
    db = await connectToSurrealDB();
    await createProductBrandRelationships(db);
    console.log("✅ Product-brand relationships created successfully!");
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