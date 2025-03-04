/**
 * Product Routes
 * 
 * Defines the routes for product-related operations
 */
import { Hono } from "hono";
import {
    getProductsHandler,
    getProductByIdHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler
} from "../controllers/product.controller";

// Create a standard router for product routes
const productRouter = new Hono();

// GET /products - Get all products
productRouter.get("/products", getProductsHandler);

// GET /products/:id - Get a product by ID
productRouter.get("/products/:id", getProductByIdHandler);

// POST /products - Create a new product
productRouter.post("/products", createProductHandler);

// PUT /products/:id - Update a product
productRouter.put("/products/:id", updateProductHandler);

// DELETE /products/:id - Delete a product
productRouter.delete("/products/:id", deleteProductHandler);

export default productRouter;
