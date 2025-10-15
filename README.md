# bun-hono-react-saas-starter

A modern full-stack SaaS starter template built with Bun, Hono, React, and TypeScript. Features authentication, database integration, and a complete user management system with organizations.

## Features

- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Modern Tech Stack**:
  - [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
  - [Hono](https://hono.dev) - Lightweight web framework for backend
  - [React](https://react.dev) - Frontend UI library
  - [Vite](https://vitejs.dev) - Fast build tool and dev server
  - [TanStack Query](https://tanstack.com/query) - Data fetching and caching
  - [TanStack Router](https://tanstack.com/router) - Type-safe routing
- **Authentication & Authorization**:
  - [better-auth](https://better-auth.com) - Complete authentication system
  - Organization management with role-based access control
  - Social authentication support
- **Database Integration**:
  - [Drizzle ORM](https://orm.drizzle.team) - Type-safe SQL ORM
  - PostgreSQL database with migrations
  - Database studio for development
- **UI Components**:
  - [shadcn/ui](https://ui.shadcn.com) - Modern component library
  - [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
  - [Lucide React](https://lucide.dev) - Beautiful icon library
- **Development Tools**:
  - [Turbo](https://turbo.build) - Build orchestration and caching
  - [Biome](https://biomejs.dev) - Fast linter and formatter
  - [Husky](https://typicode.github.io/husky) - Git hooks
  - [Vitest](https://vitest.dev) - Unit testing framework

## Project Structure

```
.
├── client/                 # React frontend with TanStack Router
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── routes/        # File-based routing with TanStack Router
│   │   └── components.json # shadcn/ui configuration
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── server/                # Hono backend API
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── db/           # Database schema and migrations
│   │   ├── middlewares/   # Hono middleware functions
│   │   ├── modules/      # Feature modules (auth, users, etc.)
│   │   ├── app.ts        # Main application setup
│   │   └── index.ts      # Server entry point
│   ├── drizzle.config.ts # Drizzle ORM configuration
│   └── .env.example      # Environment variables template
├── shared/               # Shared TypeScript definitions
│   ├── src/
│   │   ├── types/        # Shared type definitions
│   │   └── index.ts      # Exports
│   └── http-status-*     # HTTP status utilities
├── package.json          # Root package.json with workspaces
├── turbo.json           # Turbo build configuration
├── docker-compose.yml   # Docker setup for PostgreSQL
└── .env                 # Environment variables
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.2.4
- [PostgreSQL](https://postgresql.org) (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/nalakamanathunga/bun-hono-react-saas-starter.git
cd bun-hono-react-saas-starter

# Install dependencies for all workspaces
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and other settings

# Set up the database (using Docker)
docker-compose up -d

# Generate database schema and run migrations
cd server
bun run db:generate
bun run db:push
```

### Development

```bash
# Run all workspaces in development mode
bun run dev

# Or run individual workspaces
bun run dev:client    # Run React frontend (http://localhost:5173)
bun run dev:server    # Run Hono backend (http://localhost:3000)
```

### Building

```bash
# Build all workspaces
bun run build

# Or build individual workspaces
bun run build:client  # Build React frontend
bun run build:server  # Build Hono backend
```

### Testing

```bash
# Run tests across all workspaces
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch
```

### Code Quality

```bash
# Lint all workspaces
bun run lint

# Format code
bun run format

# Type check all workspaces
bun run type-check
```

## Architecture Overview

### Backend (Hono)

The server is built with Hono and follows a modular architecture:

- **Routes**: Organized by feature modules (auth, users, organizations)
- **Middleware**: Authentication, logging, rate limiting, CORS
- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: better-auth with organization support

### Frontend (React)

The client uses modern React patterns:

- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming

### Shared Types

Common TypeScript definitions are shared between client and server through the `shared` workspace, ensuring type safety across the entire application.

## Key Features

### Authentication System

- User registration and login
- Social authentication (Google, GitHub)
- Password reset functionality
- Email verification

### Organization Management

- Create and manage organizations
- Role-based access control (Owner, Admin, Member)
- Invite users to organizations
- Member management interface

### Database Schema

- Users and authentication data
- Organizations and memberships
- Sessions and security tokens
- Audit logging

### Development Experience

- Hot reload for both client and server
- Type-safe API communication
- Comprehensive error handling
- Database migrations and seeding
- Testing setup with Vitest

## Deployment

### Client Deployment

The React frontend can be deployed to any static hosting service:

```bash
# Build the client
bun run build:client

# Deploy the dist/ folder to your hosting service
```

Popular options:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

### Server Deployment

The Hono backend can be deployed to any Node.js hosting service:

```bash
# Build the server
bun run build:server

# Deploy the dist/ folder
```

Popular options:

- [Railway](https://railway.app)
- [Render](https://render.com)
- [Fly.io](https://fly.io)
- [Vercel](https://vercel.com) (serverless functions)

### Database

Use a PostgreSQL hosting service:

- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway Postgres](https://railway.app)
- [AWS RDS](https://aws.amazon.com/rds)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Hono](https://hono.dev) - The web framework for the backend
- [better-auth](https://better-auth.com) - Authentication system
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [TanStack](https://tanstack.com) - Query and Router libraries
- [Bun](https://bun.sh) - JavaScript runtime
