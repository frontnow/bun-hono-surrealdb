import { Hono } from "hono";
import { timing, setMetric, startTime, endTime } from "hono/timing";
import type { TimingVariables } from "hono/timing";
import { prettyJSON } from "hono/pretty-json";
import { languageDetector } from "hono/language";
import { cache } from "hono/cache";
import type { MiddlewareHandler } from "hono";
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

// Custom fancy logger middleware
const fancyLogger = (): MiddlewareHandler => {
  // ANSI color codes
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const dim = "\x1b[2m";

  const black = "\x1b[30m";
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const blue = "\x1b[34m";
  const magenta = "\x1b[35m";
  const cyan = "\x1b[36m";
  const white = "\x1b[37m";

  // Background colors
  const bgGreen = "\x1b[42m";
  const bgYellow = "\x1b[43m";
  const bgRed = "\x1b[41m";
  const bgBlue = "\x1b[44m";

  return async (c, next) => {
    const method = c.req.method;
    const path = c.req.path;

    // Get colorized method
    const getMethodColor = (method: string) => {
      switch (method) {
        case "GET":
          return `${bright}${green}${method}${reset}`;
        case "POST":
          return `${bright}${blue}${method}${reset}`;
        case "PUT":
          return `${bright}${yellow}${method}${reset}`;
        case "DELETE":
          return `${bright}${red}${method}${reset}`;
        case "PATCH":
          return `${bright}${magenta}${method}${reset}`;
        case "OPTIONS":
          return `${bright}${cyan}${method}${reset}`;
        default:
          return `${bright}${white}${method}${reset}`;
      }
    };

    // Get status code color
    const getStatusColor = (status: number) => {
      if (status >= 500) {
        return `${bgRed}${bright}${black} ${status} ${reset}`;
      } else if (status >= 400) {
        return `${bgYellow}${bright}${black} ${status} ${reset}`;
      } else if (status >= 300) {
        return `${bgBlue}${bright}${black} ${status} ${reset}`;
      } else if (status >= 200) {
        return `${bgGreen}${bright}${black} ${status} ${reset}`;
      } else {
        return `${bright} ${status} ${reset}`;
      }
    };

    // Log the request
    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ${cyan}⟹${reset}  ${getMethodColor(
        method
      )} ${path}`
    );

    const startTime = Date.now();
    await next();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Get response status
    const status = c.res.status;

    // Log the response
    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ${green}⟸${reset}  ${getMethodColor(
        method
      )} ${path} ${getStatusColor(status)} ${dim}${duration}ms${reset}`
    );
  };
};

// Apply middleware
app.use("*", fancyLogger());
app.use("*", prettyJSON());
app.use("*", cors());
app.use(
  languageDetector({
    supportedLanguages: ["en", "de", "fr"],
    fallbackLanguage: "en",
  })
);

// Apply timing middleware
app.use(timing());

// API Routes
const api = new Hono();

// Get all products with brand information (with pagination)
api.get("/products", async (c) => {
  try {
    startTime(c, "get-products");

    // Extract pagination parameters from query
    const limitParam = c.req.query("limit");
    const offsetParam = c.req.query("offset");

    // Parse parameters (with fallback to undefined for optional pagination)
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    // Get paginated products
    const { data: products, total } = await getProducts(limit, offset);
    endTime(c, "get-products");

    return c.json({
      success: true,
      data: products,
      pagination: {
        total,
        limit,
        offset,
        hasMore:
          limit !== undefined && total > 0
            ? (offset || 0) + limit < total
            : false,
      },
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

// No local server startup code needed for Vercel edge deployment
