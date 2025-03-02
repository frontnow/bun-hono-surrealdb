// Script to add sample products to SurrealDB for testing pagination
import { Surreal } from 'surrealdb';

// Create a connection to SurrealDB
async function connectToSurrealDB() {
  const db = new Surreal();
  
  try {
    // Connect to the SurrealDB server with namespace and database included
    await db.connect('wss://product-graph-06ab59i8odvsj7v3ve16ctlcgg.aws-euw1.surreal.cloud/rpc', {
      namespace: 'Product Graph',
      database: 'Product Graph'
    });

    // Authenticate with credentials
    await db.signin({
      username: 'root',
      password: 'VerySecurePassword!'
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
  { id: 'brands:bosch', name: 'Bosch' },
  { id: 'brands:sony', name: 'Sony' },
  { id: 'brands:samsung', name: 'Samsung' },
  { id: 'brands:apple', name: 'Apple' },
  { id: 'brands:lg', name: 'LG' }
];

// Sample products to add
const sampleProducts = [
  { 
    name: 'Smartphone Pro', 
    price: 999.99, 
    description: 'High-end smartphone with advanced features',
    brand: 'brands:apple'
  },
  { 
    name: 'Smart TV 55"', 
    price: 699.50, 
    description: 'Ultra HD Smart TV with voice control',
    brand: 'brands:samsung'
  },
  { 
    name: 'Wireless Headphones', 
    price: 249.99, 
    description: 'Noise-cancelling wireless headphones',
    brand: 'brands:sony'
  },
  { 
    name: 'Refrigerator Model X', 
    price: 1299.00, 
    description: 'Energy-efficient smart refrigerator',
    brand: 'brands:lg'
  },
  { 
    name: 'Power Drill', 
    price: 129.95, 
    description: 'Cordless power drill with extra batteries',
    brand: 'brands:bosch'
  },
  { 
    name: 'Coffee Maker', 
    price: 89.99, 
    description: 'Programmable coffee maker with timer',
    brand: 'brands:bosch'
  },
  { 
    name: 'Tablet Pro', 
    price: 799.00, 
    description: 'Lightweight tablet with long battery life',
    brand: 'brands:apple'
  },
  { 
    name: 'Washing Machine', 
    price: 649.50, 
    description: 'Front-loading washing machine with steam function',
    brand: 'brands:samsung'
  },
  { 
    name: 'Bluetooth Speaker', 
    price: 79.99, 
    description: 'Portable waterproof Bluetooth speaker',
    brand: 'brands:sony'
  },
  { 
    name: 'Air Conditioner', 
    price: 549.00, 
    description: 'Smart air conditioner with energy saving mode',
    brand: 'brands:lg'
  }
];

// Function to add sample brands if they don't exist
async function addSampleBrands(db) {
  console.log("Adding sample brands...");
  
  for (const brand of brands) {
    try {
      // Check if brand exists
      const exists = await db.query(`SELECT * FROM ${brand.id}`);
      
      if (!exists || exists.length === 0) {
        // Create the brand
        await db.query(`
          CREATE ${brand.id} SET 
          name = '${brand.name}'
        `);
        console.log(`✅ Created brand: ${brand.name}`);
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
  
  for (const product of sampleProducts) {
    try {
      // Create product record
      const result = await db.query(`
        CREATE product SET 
        name = '${product.name}',
        price = ${product.price},
        description = '${product.description}'
      `);
      
      const productId = result[0].id;
      console.log(`✅ Created product: ${product.name} with ID: ${productId}`);
      
      // Create relationship to brand
      await db.query(`
        RELATE ${productId}->product_brand->${product.brand} SET time = time::now()
      `);
      console.log(`  ↳ Linked to brand: ${product.brand}`);
      
    } catch (error) {
      console.error(`❌ Error creating product ${product.name}:`, error);
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