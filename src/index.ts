import { Hono } from "hono";
import { timing, setMetric, startTime, endTime } from "hono/timing";
import type { TimingVariables } from "hono/timing";
import { prettyJSON } from "hono/pretty-json";
import { languageDetector } from "hono/language";
import { logger } from "hono/logger";
import { cache } from "hono/cache";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import {
  getSurrealDB,
  closeSurrealDB,
  getProducts,
  getProductById,
} from "./database";
import { handle } from "hono/vercel";

export const runtime = "edge";

// Type definitions for our app variables
type Variables = TimingVariables;

// Define the app interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Sample data
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

// Create the Hono app
const app = new Hono<{ Variables: Variables }>().basePath("/api");

// Apply middleware
app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());
app.use(
  languageDetector({
    supportedLanguages: ["en", "de", "fr"],
    fallbackLanguage: "en",
  })
);

// Cache certain routes
app.get(
  "/static/*",
  cache({
    cacheName: "static-assets",
    cacheControl: "max-age=3600",
    wait: true,
  })
);

app.get(
  "/api/*",
  cache({
    cacheName: "api",
    cacheControl: "max-age=3600",
    wait: true,
  })
);

// Apply timing middleware
app.use(timing());

// Static file serving - create a public directory in your project root
app.use("/static/*", serveStatic({ root: "./" }));

// API Routes
const api = new Hono();

// Get all users
api.get("/users", (c) => {
  return c.json(users);
});

// Get user by ID
api.get("/users/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// Create a new user
api.post("/users", async (c) => {
  const body = await c.req.json<Omit<User, "id">>();

  if (!body.name || !body.email) {
    return c.json({ error: "Name and email are required" }, 400);
  }

  const newUser: User = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
  };

  users.push(newUser);
  return c.json(newUser, 201);
});

// Get all products with brand information
api.get("/products", async (c) => {
  try {
    startTime(c, "get-products");
    const products = await getProducts();
    endTime(c, "get-products");

    return c.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Get product by ID
api.get("/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    startTime(c, "get-product");
    const product = await getProductById(id);
    endTime(c, "get-product");

    if (!product) {
      return c.json(
        {
          success: false,
          error: "Product not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

// Mount the API under /api
app.route("/api", api);

// Home route with custom metrics
app.get("/", async (c) => {
  // Start a new timer
  startTime(c, "db");

  // Simulate database operation
  await new Promise((resolve) => setTimeout(resolve, 50));

  // End the timer
  endTime(c, "db");

  const lang = c.get("language");

  return c.json({
    message: "Welcome to Hono with Bun!",
    language: lang,
    endpoints: {
      api: {
        users: "/api/users",
        userById: "/api/users/:id",
      },
      root: "/",
    },
  });
});

// Start the server if this file is run directly
// Use a safer approach that doesn't rely on import.meta at all
const isDirectRun =
  !process.env.VERCEL && process.env.NODE_ENV !== "production";
if (isDirectRun) {
  const port = Number(process.env.PORT) || 3456;
  console.log(`🚀 Server running at http://localhost:${port}`);

  // Initialize the database connection
  try {
    await getSurrealDB();
  } catch (error) {
    console.error("Failed to connect to SurrealDB:", error);
    // Continue even if DB connection fails
  }

  // Clean up resources on server shutdown
  process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await closeSurrealDB();
    process.exit(0);
  });

  // Check if running in Bun environment
  const isBun = typeof Bun !== "undefined";

  if (isBun) {
    const server = Bun.serve({
      port: port,
      fetch: app.fetch,
      development: process.env.NODE_ENV !== "production",
    });

    console.log(`Listening on ${server.hostname}:${server.port}`);
  } else {
    // Node.js environment (e.g., Vercel)
    console.log("Running in Node.js environment");
    // The Vercel handler functions (GET, POST) will be used instead
  }
}

export const GET = handle(app);
export const POST = handle(app);
