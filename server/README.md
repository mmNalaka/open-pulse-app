# Server

A production-ready backend API built with **Hono** (lightweight web framework) and **Bun** (fast JavaScript runtime).

## Quick Start

### Installation

```sh
bun install
```

### Development

```sh
bun run dev
```

Server runs on `http://localhost:3000`

### Testing

```sh
# Run all tests
bun test

# Run in watch mode
bun test:watch

# Generate coverage report
bun test:coverage

# Open interactive UI
bun test:ui
```

## Tech Stack

- **Runtime:** Bun (fast JavaScript runtime)
- **Framework:** Hono (lightweight web framework)
- **Language:** TypeScript
- **Testing:** Vitest (unit, integration, e2e)
- **Database:** PostgreSQL with Drizzle ORM
- **Analytics:** ClickHouse
- **Logging:** Pino (structured logging)
- **Authentication:** Better Auth
- **Validation:** Zod

## Project Structure

```
src/
├── index.ts              # Entry point
├── app.ts                # App configuration
├── client.ts             # Database client
├── config/               # Configuration files
├── db/                   # Database setup and migrations
├── middlewares/          # Express middlewares
└── modules/              # Feature modules
    ├── auth/             # Authentication
    ├── health/           # Health checks
    └── track/            # Event tracking

tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
├── e2e/                  # E2E tests (future)
├── fixtures/             # Test data and mocks
├── utils/                # Test utilities
└── setup.ts              # Global test setup
```

## Available Scripts

### Development

```sh
bun run dev              # Start development server with hot reload
bun run build            # Build TypeScript
```

### Testing

```sh
bun test                 # Run all tests
bun test:watch           # Watch mode
bun test:unit            # Unit tests only
bun test:integration     # Integration tests only
bun test:e2e             # E2E tests only
bun test:coverage        # Coverage report
bun test:ui              # Interactive dashboard
```

### Database

```sh
bun run db:push          # Push schema to database
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:studio        # Open Drizzle Studio
```

## API Endpoints

### Health

- `GET /api/health/health` - Health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/metrics` - Metrics endpoint

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Tracking

- `POST /track` - Track events (pageviews, custom events, errors)

## Testing

The project includes a comprehensive, production-ready test suite:

### Test Types

- **Unit Tests** - Test individual functions and utilities
- **Integration Tests** - Test API endpoints and features
- **E2E Tests** - Test complete user workflows (future)

### Running Tests

```sh
# All tests
bun test

# Specific type
bun test tests/unit
bun test tests/integration

# Watch mode
bun test:watch

# Coverage (target: 70%)
bun test:coverage
```

### Test Documentation

See `tests/README.md` and `tests/STRUCTURE.md` for detailed testing information.

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```sh
cp .env.example .env
```

### Vitest Configuration

See `vitest.config.ts` for test configuration including:

- Path aliases (`@` for src, `@tests` for tests)
- Coverage thresholds (70%)
- Test timeout (10 seconds)

## Development Workflow

1. **Start development server**

   ```sh
   bun run dev
   ```

2. **Write tests** (in `tests/` directory)

   ```sh
   bun test:watch
   ```

3. **Implement features** (in `src/` directory)

4. **Check coverage**

   ```sh
   bun test:coverage
   ```

5. **Build for production**
   ```sh
   bun run build
   ```

## Database

### Setup

```sh
# Generate migrations
bun run db:generate

# Push schema
bun run db:push

# View database
bun run db:studio
```

### ORM

Using Drizzle ORM for type-safe database queries.

## Logging

Structured logging with Pino:

```typescript
const logger = c.get("logger");
logger.info("Event tracked", { event_id: "123" });
```

## Error Handling

Global error handling middleware in `src/middlewares/on-error.mw.ts`

## CORS

CORS configuration in `src/config/app.config.ts`

## Performance

- Lightweight Hono framework
- Fast Bun runtime
- Structured logging
- Request ID tracking
- Rate limiting support

## Production Deployment

1. Build the project

   ```sh
   bun run build
   ```

2. Run tests

   ```sh
   bun test
   ```

3. Deploy `dist/` directory

## Resources

- [Hono Documentation](https://hono.dev/)
- [Bun Documentation](https://bun.sh/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vitest](https://vitest.dev/)
- [Pino Logging](https://getpino.io/)

## Support

For questions or issues:

1. Check test examples in `tests/integration/`
2. Review API documentation in endpoint files
3. See `tests/README.md` for testing guide
