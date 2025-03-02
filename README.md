# Hono with Bun

A modern web API built with [Hono](https://hono.dev/) and [Bun](https://bun.sh/).

## Features

- ⚡️ Ultra-fast API powered by Bun runtime
- 🎯 Built with TypeScript for type safety
- 🧩 Modular architecture with route grouping
- ⚙️ Includes middleware for logging, CORS, caching, and more
- 🔄 Hot module reloading during development
- 🗂️ Static file serving
- 📊 Performance metrics and timing

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)

### Installation

```sh
# Clone the repository (if you haven't already)
# git clone https://your-repository-url.git

# Install dependencies
bun install
```

### Development

```sh
# Start the development server with hot reloading
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production

```sh
# Build the application
bun run build

# Start the production server
bun run start
```

## API Endpoints

### Home
- `GET /` - Returns welcome information and available endpoints

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
  - Required fields: `name`, `email`

### Static Assets
- `GET /static/*` - Serves static files from the public directory

## Project Structure

```
/
├── public/            # Static assets
│   ├── index.html     # Frontend demo page
│   ├── styles.css     # CSS styles
│   └── main.js        # Frontend JavaScript
├── src/
│   └── index.ts       # Main application entry point
├── package.json       # Project configuration
└── tsconfig.json      # TypeScript configuration
```

## License

MIT
