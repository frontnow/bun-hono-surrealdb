// Script to add sample products to SurrealDB for testing pagination
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

// Sample brands to reference in products
const brands = [
  { id: "brands:bosch", name: "Bosch" },
  { id: "brands:sony", name: "Sony" },
  { id: "brands:samsung", name: "Samsung" },
  { id: "brands:apple", name: "Apple" },
  { id: "brands:lg", name: "LG" },
];

// Sample products to add
const sampleProducts = [
  {
    name: "Smartphone Pro",
    price: 999.99,
    description: "High-end smartphone with advanced features",
    url: "https://example.com/smartphone-pro",
    brand: "brands:apple",
  },
  {
    name: 'Smart TV 55"',
    price: 699.5,
    description: "Ultra HD Smart TV with voice control",
    url: "https://example.com/smart-tv-55",
    brand: "brands:samsung",
  },
  {
    name: "Wireless Headphones",
    price: 249.99,
    description: "Noise-cancelling wireless headphones",
    url: "https://example.com/wireless-headphones",
    brand: "brands:sony",
  },
  {
    name: "Refrigerator Model X",
    price: 1299.0,
    description: "Energy-efficient smart refrigerator",
    url: "https://example.com/refrigerator-model-x",
    brand: "brands:lg",
  },
  {
    name: "Power Drill",
    price: 129.95,
    description: "Cordless power drill with extra batteries",
    url: "https://example.com/power-drill",
    brand: "brands:bosch",
  },
  {
    name: "Coffee Maker",
    price: 89.99,
    description: "Programmable coffee maker with timer",
    url: "https://example.com/coffee-maker",
    brand: "brands:bosch",
  },
  {
    name: "Tablet Pro",
    price: 799.0,
    description: "Lightweight tablet with long battery life",
    url: "https://example.com/tablet-pro",
    brand: "brands:apple",
  },
  {
    name: "Washing Machine",
    price: 649.5,
    description: "Front-loading washing machine with steam function",
    url: "https://example.com/washing-machine",
    brand: "brands:samsung",
  },
  {
    name: "Bluetooth Speaker",
    price: 79.99,
    description: "Portable waterproof Bluetooth speaker",
    url: "https://example.com/bluetooth-speaker",
    brand: "brands:sony",
  },
  {
    name: "Air Conditioner",
    price: 549.0,
    description: "Smart air conditioner with energy saving mode",
    url: "https://example.com/air-conditioner",
    brand: "brands:lg",
  },
];

// Function to add sample brands if they don't exist
async function addSampleBrands(db) {
  console.log("Adding sample brands...");

  for (const brand of brands) {
    try {
      // Check if brand exists
      console.log(`Checking if brand exists: ${brand.id}`);
      const exists = await db.query(`SELECT * FROM ${brand.id}`);
      console.log(`Query result for ${brand.id}:`, JSON.stringify(exists));

      if (
        !exists ||
        exists.length === 0 ||
        (Array.isArray(exists) && exists[0] === null)
      ) {
        // Create the brand
        console.log(`Creating brand: ${brand.name} with ID ${brand.id}`);
        const result = await db.query(`
          CREATE ${brand.id} SET 
          name = '${brand.name}'
        `);
        console.log(`✅ Created brand result:`, JSON.stringify(result));
      } else {
        console.log(`ℹ️ Brand already exists: ${brand.name}`);
      }
    } catch (error) {
      console.error(`❌ Error creating brand ${brand.name}:`, error);
    }
  }
}

// Function to add sample products
async function addSampleProducts(db) {
  console.log("Adding sample products...");

  // First get existing products to avoid duplicates
  const existingProducts = await db.query(`SELECT name FROM product`);
  console.log("Existing products:", JSON.stringify(existingProducts));

  const existingNames = new Set();
  if (
    Array.isArray(existingProducts) &&
    existingProducts.length > 0 &&
    existingProducts[0]
  ) {
    existingProducts[0].forEach((product) => {
      if (product && product.name) {
        existingNames.add(product.name);
      }
    });
  }

  console.log(`Found ${existingNames.size} existing products`);

  for (const product of sampleProducts) {
    try {
      // Skip if product with same name already exists
      if (existingNames.has(product.name)) {
        console.log(`⏭️ Skipping existing product: ${product.name}`);
        continue;
      }

      // Create product record
      console.log(`Creating product: ${product.name}`);
      const result = await db.query(`
        CREATE product SET 
        name = '${product.name}',
        price = ${product.price},
        description = '${product.description}',
        url = '${product.url}'
      `);

      console.log(`Create product result:`, JSON.stringify(result));

      if (
        !result ||
        !Array.isArray(result) ||
        result.length === 0 ||
        !result[0]
      ) {
        throw new Error(`Failed to create product: ${product.name}`);
      }

      const productId = result[0].id;
      console.log(`✅ Created product: ${product.name} with ID: ${productId}`);

      // Create relationship to brand
      console.log(`Creating relationship: ${productId} -> ${product.brand}`);
      const relateResult = await db.query(`
        RELATE ${productId}->product_brand->${product.brand} SET time = time::now()
      `);

      console.log(`Relationship result:`, JSON.stringify(relateResult));
      console.log(`  ↳ Linked to brand: ${product.brand}`);
    } catch (error) {
      console.error(`❌ Error creating product ${product.name}:`, error);
      console.error(error.stack);
    }
  }
}

// Main function to run the script
async function main() {
  let db;
  try {
    db = await connectToSurrealDB();

    // Add brands first
    await addSampleBrands(db);

    // Then add products with brand relationships
    await addSampleProducts(db);

    console.log("✅ Sample data addition completed successfully!");
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
