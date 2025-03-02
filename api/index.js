import app from "../dist/index.js";
import { handle } from "@hono/node-server/vercel";

// Use Hono's official Vercel handler
export default handle(app);
