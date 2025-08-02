# KARS Drones API

A Bun-powered API server for managing drone competition data with an admin panel.

## Features

- 🚀 Built with Bun for maximum performance
- 🎯 RESTful API endpoints for drone data
- 🔐 Admin panel with authentication
- 🔄 Round-based data management
- 🐳 Docker support for easy deployment

## Quick Start

### Development

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun dev

# Or using Docker for development
bun run docker:dev
```

### Production

```bash
# Start production server
bun start

# Or using Docker for production
bun run docker:prod
```

## API Endpoints

- `GET /key1` - Get key1 value from current round
- `GET /key2` - Get key2 value from current round
- `GET /key3` - Get key3 value from current round
- `GET /current-round` - Get current active round info
- `GET /admin?auth=password` - Admin panel with authentication

## Admin Panel

Visit `/admin?auth=yourpassword` to:

- View all data in a table
- Change the current active round
- Add/update data for any round

## Environment Variables

Create a `.env` file:

```
ADMIN_PASS=your_admin_password
```

## Docker

### Development with hot reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production:

```bash
docker-compose up --build
```

The server runs on port 3002 by default.
