# Bun-Hono API

A modern web API built with Hono, Bun, and SurrealDB that follows clean architecture principles.

## Features

- 🚀 Built with [Bun](https://bun.sh/) for ultra-fast JavaScript runtime
- 🌐 [Hono](https://hono.dev/) web framework for efficient routing and middleware
- 📊 [SurrealDB](https://surrealdb.com/) for flexible graph database
- 📝 OpenAPI/Swagger documentation
- 🧩 Clean architecture with separation of concerns
- 🔄 Type-safe APIs with Zod validation
- ☁️ Ready for Vercel deployment

## Project Structure

```
src/
├── config/                # Configuration files
│   ├── database.ts        # Database configuration
│   ├── environment.ts     # Environment variable management
│   └── swagger.ts         # Swagger configuration
├── controllers/           # Request handlers
│   └── product.controller.ts
├── middleware/            # Middleware functions
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── models/                # Data models and type definitions
│   ├── brand.model.ts
│   └── product.model.ts
├── repositories/          # Data access layer
│   └── product.repository.ts
├── routes/                # API route definitions
│   └── product.routes.ts
├── utils/                 # Utility functions
│   └── response.utils.ts
├── app.ts                 # Main application setup
└── server.ts              # Server entry point
```

## Getting Started

### Prerequisites

- Bun installed: [Bun Installation Guide](https://bun.sh/docs/installation)
- SurrealDB instance: [SurrealDB Installation Guide](https://surrealdb.com/docs/installation)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bun-hono
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your SurrealDB connection details and other configuration.

### Development

Start the development server:
```bash
bun run dev
```

The server will start on the port specified in your `.env` file (default: 3457).

### Production Build

Build the project for production:
```bash
bun run build
```

Run the production build:
```bash
bun run start
```

## API Documentation

Swagger UI documentation is available at `/api/docs` when the server is running.

## Deployment

### Vercel

This project is configured for Vercel deployment. The `vercel.json` file and server exports are set up for serverless functions.

## License

MIT
