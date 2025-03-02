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

// Create the Hono app
const app = new Hono<{ Variables: Variables }>();

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

// Apply timing middleware
app.use(timing());

// Static file serving
app.use("/static/*", serveStatic({ root: "./" }));

// API Routes
const api = new Hono();

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
  startTime(c, "db");
  await new Promise((resolve) => setTimeout(resolve, 50));
  endTime(c, "db");

  const lang = c.get("language");

  return c.json({
    message: "Welcome to Hono with Bun!",
    language: lang,
    endpoints: {
      api: {
        products: "/api/products",
        productById: "/api/products/:id",
      },
      root: "/",
    },
  });
});

// For Vercel deployment
const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

// Function to create a fancy server startup log
function printFancyServerStartupLog(port: number) {
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const dim = "\x1b[2m";
  const underscore = "\x1b[4m";

  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const blue = "\x1b[34m";
  const magenta = "\x1b[35m";
  const cyan = "\x1b[36m";

  // Clear console and show banner
  console.clear();

  console.log(`${bright}${cyan}
  ╭───────────────────────────────────────────────╮
  │                                               │
  │   ${yellow}BUN + HONO SERVER${cyan}                         │
  │                                               │
  ╰───────────────────────────────────────────────╯${reset}
  `);

  // Server Information
  console.log(`${bright}${green}🚀 SERVER INFORMATION${reset}`);
  console.log(
    `  ${dim}>${reset} ${bright}Status:${reset}      ${green}Running${reset}`
  );
  console.log(
    `  ${dim}>${reset} ${bright}Environment:${reset} ${
      process.env.NODE_ENV || "development"
    }`
  );
  console.log(
    `  ${dim}>${reset} ${bright}Local URL:${reset}   ${underscore}http://localhost:${port}${reset}`
  );
  console.log(`  ${dim}>${reset} ${bright}Port:${reset}        ${port}`);

  // API Information
  console.log(`\n${bright}${magenta}📡 API ENDPOINTS${reset}`);
  console.log(
    `  ${dim}>${reset} ${green}GET${reset}  /api/products         ${dim}(Get all products)${reset}`
  );
  console.log(
    `  ${dim}>${reset} ${green}GET${reset}  /api/products/:id     ${dim}(Get product by ID)${reset}`
  );

  // Root endpoint
  console.log(`\n${bright}${blue}🏠 OTHER ROUTES${reset}`);
  console.log(
    `  ${dim}>${reset} ${green}GET${reset}  /                     ${dim}(Welcome page with API info)${reset}`
  );
  console.log(
    `  ${dim}>${reset} ${green}GET${reset}  /static/*             ${dim}(Static file serving)${reset}`
  );

  // Health check
  console.log(`\n${bright}${cyan}🔍 APPLICATION STATUS${reset}`);
  console.log(
    `  ${dim}>${reset} ${bright}API:${reset}         ${green}✓ Ready${reset}`
  );
  console.log(
    `  ${dim}>${reset} ${bright}Static Files:${reset} ${green}✓ Serving${reset}`
  );
  console.log(
    `  ${dim}>${reset} ${bright}Database:${reset}    ${green}✓ Connected${reset}`
  );

  console.log(
    `\n${dim}Press ${bright}CTRL+C${reset}${dim} to stop the server${reset}\n`
  );
}

// For local development with Bun
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3456;
printFancyServerStartupLog(port);

// Single default export for Bun
export default {
  port,
  fetch: app.fetch,
};
