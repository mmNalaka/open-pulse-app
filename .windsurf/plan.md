You are a senior backend engineer helping me reimplement parts of Hanko (Go) in **TypeScript** using **Bun** and **HonoJS**.

## Background

- The original service is Hanko’s Go backend (see GitHub).
- It implements passkey / WebAuthn flows, user + session management, OAuth / SSO, admin APIs, audit logs, etc.
- Uses Postgres (or SQL) for persistence, uses configuration file (YAML) + environment variables.
- Session tokens are stored / validated, JWT or cookie-based.
- It supports things like TOTP 2FA, OAuth, email flows, etc.

## Executive Summary

This document provides a comprehensive migration plan for porting the Hanko authentication backend from Go to Bun runtime with HonoJS framework. Hanko is a privacy-first authentication system supporting passkeys (WebAuthn), passwords, passcodes, OAuth SSO, and JWT management.

---

## 1. Project Overview

### Current Stack (Go)

- **Language**: Go (Golang)
- **Framework**: Chi/Gin router (typical Go HTTP frameworks)
- **Database**: PostgreSQL with GORM/sqlx
- **Features**:
  - WebAuthn/Passkey authentication
  - Password authentication
  - Email passcodes
  - OAuth SSO
  - JWT token management
  - User and session management
  - SMTP email integration

### Target Stack (Bun + Hono)

- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: HonoJS (ultra-fast web framework)
- **Database**: PostgreSQL with Drizzle ORM or Prisma
- **TypeScript**: Strict type safety throughout

---

## 2. Architecture Analysis

### Core Components to Migrate

#### 2.1 Configuration System

**Go Implementation**:

```go
// backend/config/
- config.go
- database.go
- server.go
- webauthn.go
- email.go
- oauth.go
```

**Bun/Hono Migration**:

- Use **Zod** for configuration schema validation
- Environment-based config with `.env` support
- Create typed configuration objects using TypeScript interfaces
- Implement hot-reload for development

**Implementation Strategy**:

```typescript
// src/config/index.ts
import { z } from "zod";

const ConfigSchema = z.object({
  server: z.object({
    port: z.number().default(8080),
    host: z.string().default("0.0.0.0"),
    cors: z.object({
      allowedOrigins: z.array(z.string()),
      allowCredentials: z.boolean(),
    }),
  }),
  database: z.object({
    host: z.string(),
    port: z.number(),
    name: z.string(),
    user: z.string(),
    password: z.string(),
  }),
  jwt: z.object({
    secret: z.string(),
    expirationTime: z.string(),
  }),
  // ... more config
});
```

#### 2.2 Database Layer

**Go Implementation**:

```go
// backend/persistence/
- models/
  - user.go
  - session.go
  - credential.go
  - passcode.go
- migrations/
```

**Bun/Hono Migration**:

- **Option A**: Use **Drizzle ORM** (recommended for Bun)
  - Type-safe queries
  - SQL-like syntax
  - Excellent TypeScript inference
  - Built-in migrations
- **Option B**: Use **Prisma**
  - More mature ecosystem
  - Better documentation
  - Automatic type generation

**Implementation Strategy**:

```typescript
// Using Drizzle ORM
// src/db/schema.ts
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  credentialId: text("credential_id").unique().notNull(),
  publicKey: text("public_key").notNull(),
  counter: serial("counter").default(0),
  // ... more fields
});
```

#### 2.3 API Routes & Handlers

**Go Implementation**:

```go
// backend/handler/
- user.go
- webauthn.go
- passcode.go
- password.go
- session.go
- oauth.go
- admin.go
```

**Bun/Hono Migration**:

- Use HonoJS routing with TypeScript
- Implement middleware chain (auth, CORS, rate limiting)
- Create modular route handlers
- Use Hono's RPC for type-safe API contracts

**Implementation Strategy**:

```typescript
// src/routes/user.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const userRoute = new Hono();

// Type-safe route with validation
userRoute.post(
  "/register",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(8).optional(),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");
    // Handler logic
    return c.json({ userId: "..." });
  }
);

export default userRoute;
```

#### 2.4 WebAuthn Implementation

**Go Implementation**:

```go
// Uses: github.com/go-webauthn/webauthn
- registration flow
- authentication flow
- credential management
```

**Bun/Hono Migration**:

- Use **@simplewebauthn/server** (industry standard)
- Implement registration ceremony
- Implement authentication ceremony
- Handle credential storage and verification

**Implementation Strategy**:

```typescript
// src/services/webauthn.ts
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

export class WebAuthnService {
  async startRegistration(userId: string, userEmail: string) {
    const options = await generateRegistrationOptions({
      rpName: 'Hanko',
      rpID: process.env.RP_ID!,
      userID: userId,
      userName: userEmail,
      attestationType: 'none',
      // ... more options
    });
    return options;
  }

  async verifyRegistration(userId: string, response: any) {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: /* stored challenge */,
      expectedOrigin: process.env.ORIGIN!,
      expectedRPID: process.env.RP_ID!,
    });
    return verification;
  }
}
```

#### 2.5 Authentication & JWT

**Go Implementation**:

```go
// Uses: github.com/golang-jwt/jwt
- JWT generation
- JWT validation
- Token refresh
- Session management
```

**Bun/Hono Migration**:

- Use **jose** library (recommended) or **jsonwebtoken**
- Implement JWT middleware for Hono
- Handle token refresh logic
- Session cookie management

**Implementation Strategy**:

```typescript
// src/middleware/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { Context, Next } from "hono";

export async function generateJWT(userId: string, email: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  return token;
}

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    c.set("user", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
}
```

#### 2.6 Email Service (SMTP)

**Go Implementation**:

```go
// Uses: net/smtp or third-party library
- Passcode emails
- Verification emails
- Password reset emails
```

**Bun/Hono Migration**:

- Use **nodemailer** for SMTP
- Create email templates with React Email or MJML
- Implement retry logic with async queues

**Implementation Strategy**:

```typescript
// src/services/email.ts
import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendPasscode(email: string, code: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Your verification code",
      html: `<p>Your code: <strong>${code}</strong></p>`,
    });
  }
}
```

#### 2.7 OAuth Integration

**Go Implementation**:

```go
// Supports: Google, GitHub, Apple, Microsoft, etc.
- OAuth flow initiation
- Callback handling
- User profile fetching
- Account linking
```

**Bun/Hono Migration**:

- Use **Arctic** (modern OAuth library) or **@hono/oauth-providers**
- Implement OAuth middleware
- Handle state validation
- User account linking logic

**Implementation Strategy**:

```typescript
// src/services/oauth.ts
import { GitHub, Google } from "arctic";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
  process.env.GITHUB_REDIRECT_URI!
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

// Route handler
userRoute.get("/oauth/github", async (c) => {
  const state = crypto.randomUUID();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  // Store state in session
  return c.redirect(url.toString());
});
```

#### 2.8 Rate Limiting & Security

**Go Implementation**:

```go
// Rate limiting middleware
// CORS handling
// Input validation
```

**Bun/Hono Migration**:

- Use **@hono/rate-limiter** or implement custom
- Use **@hono/cors** for CORS handling
- Use **Zod** for input validation
- Implement CSRF protection

**Implementation Strategy**:

```typescript
// src/middleware/rateLimit.ts
import { rateLimiter } from "hono-rate-limiter";

export const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  keyGenerator: (c) => c.req.header("x-forwarded-for") || "unknown",
});
```

---

## 3. Project Structure

### Recommended Directory Layout

```
hanko-bun/
├── src/
│   ├── config/
│   │   ├── index.ts              # Main config loader
│   │   ├── database.ts           # DB config
│   │   ├── server.ts             # Server config
│   │   └── schemas.ts            # Zod validation schemas
│   ├── db/
│   │   ├── schema/               # Drizzle schema definitions
│   │   │   ├── users.ts
│   │   │   ├── credentials.ts
│   │   │   ├── sessions.ts
│   │   │   └── passcodes.ts
│   │   ├── migrations/           # SQL migrations
│   │   └── index.ts              # DB connection
│   ├── routes/
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.ts               # Auth routes
│   │   ├── user.ts               # User management
│   │   ├── webauthn.ts           # WebAuthn routes
│   │   ├── passcode.ts           # Passcode routes
│   │   ├── password.ts           # Password routes
│   │   ├── oauth.ts              # OAuth routes
│   │   └── admin.ts              # Admin routes
│   ├── services/
│   │   ├── webauthn.ts           # WebAuthn service
│   │   ├── jwt.ts                # JWT service
│   │   ├── email.ts              # Email service
│   │   ├── oauth.ts              # OAuth service
│   │   ├── passcode.ts           # Passcode generation
│   │   └── session.ts            # Session management
│   ├── middleware/
│   │   ├── auth.ts               # Auth middleware
│   │   ├── cors.ts               # CORS config
│   │   ├── rateLimit.ts          # Rate limiting
│   │   ├── validation.ts         # Input validation
│   │   └── errorHandler.ts      # Error handling
│   ├── types/
│   │   ├── api.ts                # API types
│   │   ├── auth.ts               # Auth types
│   │   └── database.ts           # DB types
│   ├── utils/
│   │   ├── crypto.ts             # Crypto utilities
│   │   ├── logger.ts             # Logging
│   │   └── validators.ts        # Custom validators
│   └── index.ts                  # App entry point
├── tests/
│   ├── integration/
│   ├── unit/
│   └── fixtures/
├── drizzle/                      # Drizzle config
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── bunfig.toml                   # Bun config
└── README.md
```

---

## 4. Migration Steps (Phase-by-Phase)

### Phase 1: Project Setup & Core Infrastructure (Week 1)

**Tasks**:

1. Initialize Bun project with TypeScript

   ```bash
   bun init
   bun add hono drizzle-orm postgres zod
   bun add -d @types/node drizzle-kit
   ```

2. Set up configuration system with Zod schemas
3. Configure database connection with Drizzle
4. Set up logging infrastructure
5. Create basic Hono server with health check endpoint
6. Configure hot-reload for development

**Deliverables**:

- Running Hono server on port 8080
- Database connection established
- Configuration loading from environment
- Health check endpoint: `GET /health`

**Testing Criteria**:

- Server starts without errors
- Database migrations run successfully
- Configuration validates correctly

---

### Phase 2: Database Schema & Migrations (Week 2)

**Tasks**:

1. Define all database schemas using Drizzle:
   - `users` table
   - `webauthn_credentials` table
   - `sessions` table
   - `passcodes` table
   - `oauth_accounts` table
   - `audit_logs` table

2. Create migration files
3. Implement database seeding for development
4. Create repository layer (data access objects)

**Deliverables**:

- Complete Drizzle schema definitions
- Migration scripts
- Seed data script
- Type-safe database queries

**Testing Criteria**:

- All migrations run successfully
- Foreign key constraints work
- Indexes are created
- Type inference works correctly

---

### Phase 3: Authentication Core (Week 3-4)

**Tasks**:

1. Implement JWT service:
   - Token generation
   - Token validation
   - Refresh token logic
   - JWKS endpoint for public key

2. Implement session management:
   - Session creation
   - Session validation
   - Session revocation
   - Cookie handling

3. Create authentication middleware
4. Implement password authentication:
   - Registration with password
   - Login with password
   - Password hashing with bcrypt/argon2
   - Password reset flow

**Deliverables**:

- JWT service with signing and verification
- Session management system
- Password auth routes:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/refresh`

**Testing Criteria**:

- JWT tokens are valid and verifiable
- Sessions persist correctly
- Password hashing is secure
- Auth middleware blocks unauthorized requests

---

### Phase 4: WebAuthn Implementation (Week 5-6)

**Tasks**:

1. Integrate @simplewebauthn/server
2. Implement registration flow:
   - Generate registration options
   - Verify registration response
   - Store credential in database

3. Implement authentication flow:
   - Generate authentication options
   - Verify authentication response
   - Update credential counter

4. Create credential management endpoints:
   - List user credentials
   - Delete credential
   - Update credential nickname

**Deliverables**:

- WebAuthn routes:
  - `POST /webauthn/register/initialize`
  - `POST /webauthn/register/finalize`
  - `POST /webauthn/login/initialize`
  - `POST /webauthn/login/finalize`
  - `GET /webauthn/credentials`
  - `DELETE /webauthn/credentials/:id`

**Testing Criteria**:

- Registration ceremony completes successfully
- Authentication ceremony works with stored credentials
- Credentials are stored and retrieved correctly
- Counter validation prevents replay attacks

---

### Phase 5: Passcode Authentication (Week 7)

**Tasks**:

1. Implement passcode generation:
   - 6-digit random code
   - Time-limited validity (10 minutes)
   - Rate limiting per email

2. Integrate email service:
   - Configure nodemailer
   - Create email templates
   - Send passcode emails
   - Handle SMTP errors

3. Implement passcode verification:
   - Validate code
   - Check expiration
   - Invalidate after use
   - Track failed attempts

**Deliverables**:

- Passcode routes:
  - `POST /passcode/initialize` (send code)
  - `POST /passcode/finalize` (verify code)
- Email service with templates
- Rate limiting on passcode requests

**Testing Criteria**:

- Passcodes are generated randomly
- Emails are sent successfully
- Codes expire after 10 minutes
- Used codes cannot be reused
- Rate limiting prevents abuse

---

### Phase 6: OAuth Integration (Week 8-9)

**Tasks**:

1. Integrate Arctic OAuth library
2. Implement OAuth providers:
   - Google
   - GitHub
   - Apple
   - Microsoft

3. Handle OAuth flow:
   - Authorization URL generation
   - State validation
   - Callback handling
   - Token exchange
   - User profile fetching

4. Implement account linking:
   - Link OAuth account to existing user
   - Create new user from OAuth
   - Unlink OAuth account

**Deliverables**:

- OAuth routes:
  - `GET /oauth/:provider` (start flow)
  - `GET /oauth/:provider/callback`
  - `GET /oauth/accounts` (list linked accounts)
  - `DELETE /oauth/accounts/:provider`
- Support for major OAuth providers

**Testing Criteria**:

- OAuth flows complete successfully
- State validation prevents CSRF
- User profiles are fetched correctly
- Account linking works properly

---

### Phase 7: User & Session Management (Week 10)

**Tasks**:

1. Implement user profile endpoints:
   - Get user profile
   - Update user profile
   - Update email
   - Delete account

2. Implement session management:
   - List active sessions
   - Revoke session
   - Revoke all sessions

3. Add email verification flow
4. Implement account recovery

**Deliverables**:

- User routes:
  - `GET /user/me`
  - `PATCH /user/me`
  - `POST /user/email`
  - `DELETE /user/me`
- Session routes:
  - `GET /sessions`
  - `DELETE /sessions/:id`
  - `DELETE /sessions` (revoke all)

**Testing Criteria**:

- User can view and update profile
- Email changes require verification
- Sessions can be managed
- Account deletion is permanent

---

### Phase 8: Admin API (Week 11)

**Tasks**:

1. Implement admin authentication:
   - API key authentication
   - Admin JWT tokens
   - Permission system

2. Create admin endpoints:
   - List users
   - Get user details
   - Delete user
   - View audit logs
   - Manage global settings

3. Implement rate limiting for admin API
4. Add audit logging for admin actions

**Deliverables**:

- Admin routes:
  - `GET /admin/users`
  - `GET /admin/users/:id`
  - `DELETE /admin/users/:id`
  - `GET /admin/audit-logs`
  - `GET /admin/stats`

**Testing Criteria**:

- Admin API requires authentication
- Admin actions are logged
- Rate limiting is enforced
- Permissions are checked

---

### Phase 9: Security & Hardening (Week 12)

**Tasks**:

1. Implement comprehensive rate limiting:
   - Per-endpoint limits
   - IP-based limits
   - User-based limits

2. Add CORS configuration
3. Implement CSRF protection
4. Add request validation middleware
5. Implement security headers:
   - Helmet.js equivalent
   - CSP headers
   - HSTS

6. Add input sanitization
7. Implement brute-force protection

**Deliverables**:

- Rate limiting on all endpoints
- CORS properly configured
- Security headers on all responses
- Input validation with Zod

**Testing Criteria**:

- Rate limits are enforced
- CORS blocks unauthorized origins
- Invalid input is rejected
- Security headers are present

---

### Phase 10: Testing & Documentation (Week 13-14)

**Tasks**:

1. Write unit tests for all services:
   - JWT service
   - WebAuthn service
   - Email service
   - OAuth service

2. Write integration tests for all routes
3. Set up E2E testing with Playwright
4. Create API documentation:
   - OpenAPI/Swagger spec
   - Interactive API explorer
   - Code examples

5. Write deployment guide
6. Create migration guide from Go version

**Deliverables**:

- 80%+ code coverage
- Complete API documentation
- Deployment guide
- Migration guide

**Testing Criteria**:

- All tests pass
- Documentation is accurate
- API examples work

---

## 5. Key Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/zod-validator": "^0.2.0",
    "drizzle-orm": "^0.33.0",
    "postgres": "^3.4.0",
    "zod": "^3.22.0",
    "jose": "^5.0.0",
    "@simplewebauthn/server": "^9.0.0",
    "nodemailer": "^6.9.0",
    "arctic": "^1.0.0",
    "bcrypt": "^5.1.0",
    "@hono/rate-limiter": "^0.3.0",
    "pino": "^8.16.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/node": "^20.0.0",
    "@types/nodemailer": "^6.4.0",
    "@types/bcrypt": "^5.0.0",
    "drizzle-kit": "^0.24.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Package Explanations

**Hono**: Ultra-fast web framework, similar to Express but optimized for edge runtimes
**Drizzle ORM**: Type-safe ORM with SQL-like syntax, perfect for TypeScript
**Zod**: Schema validation library for runtime type checking
**jose**: JWT operations library, more modern than jsonwebtoken
**@simplewebauthn/server**: Complete WebAuthn implementation for Node.js
**Arctic**: Modern OAuth 2.0 library with TypeScript support
**pino**: Fast JSON logger

---

## 6. Critical Migration Considerations

### 6.1 Concurrency Model Differences

**Go**: Goroutines with channels

```go
go func() {
    // Async operation
}()
```

**Bun/TypeScript**: Async/await with Promises

```typescript
await asyncOperation();
// or
Promise.all([op1(), op2()]);
```

**Action**: Identify all goroutines in Go code and convert to async functions

---

### 6.2 Error Handling

**Go**: Multiple return values with error

```go
result, err := operation()
if err != nil {
    return err
}
```

**TypeScript**: Try-catch with exceptions

```typescript
try {
  const result = await operation();
} catch (error) {
  // Handle error
}
```

**Action**: Wrap all async operations in try-catch blocks, create custom error classes

---

### 6.3 Type Safety

**Go**: Static typing at compile time
**TypeScript**: Static typing + runtime validation needed

**Action**: Use Zod for runtime validation of all external inputs (request bodies, env vars, DB results)

---

### 6.4 Database Connection Pooling

**Go**: Built-in with database/sql
**Bun**: Need to configure explicitly

**Action**: Configure connection pool in Drizzle:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  max: 20,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db = drizzle(client);
```

---

### 6.5 Binary Data Handling

**Go**: Native byte arrays
**JavaScript**: Buffer or Uint8Array

**Action**: Use Buffer for binary data (WebAuthn credentials, encryption keys)

---

### 6.6 Cryptography

**Go**: crypto package
**Bun**: crypto module + Web Crypto API

**Action**: Use Web Crypto API for cryptographic operations:

```typescript
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"]
);
```

---

### 6.7 Performance Considerations

**Bun Advantages**:

- Faster startup time
- Built-in SQLite (if needed)
- Native bundler
- Fast HTTP server

**Action**:

- Use Bun's native APIs where possible
- Profile critical paths
- Implement caching for hot paths
- Use connection pooling effectively

---

## 7. Testing Strategy

### Unit Tests

**Tool**: Vitest (fast, Vite-powered test runner)

**Coverage**:

- All service layer functions
- Middleware functions
- Utility functions
- Validation schemas

**Example**:

```typescript
import { describe, it, expect } from "vitest";
import { generateJWT, verifyJWT } from "../services/jwt";

describe("JWT Service", () => {
  it("should generate and verify valid token", async () => {
    const token = await generateJWT("user123", "test@example.com");
    const payload = await verifyJWT(token);
    expect(payload.userId).toBe("user123");
  });
});
```

---

### Integration Tests

**Tool**: Vitest + Supertest equivalent

**Coverage**:

- All API endpoints
- Database operations
- Authentication flows
- WebAuthn ceremonies

**Example**:

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../index";

describe("POST /auth/register", () => {
  it("should register new user", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty("userId");
  });
});
```

---

### E2E Tests

**Tool**: Playwright

**Coverage**:

- Complete authentication flows
- WebAuthn with virtual authenticator
- OAuth flows
- Session management

---

## 8. Deployment Considerations

### Docker Configuration

```dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build if needed
RUN bun run build

# Run
EXPOSE 8080
CMD ["bun", "run", "start"]
```

### Environment Variables

```bash
# Server
PORT=8080
HOST=0.0.0.0
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/hanko

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# WebAuthn
RP_ID=example.com
RP_NAME=Hanko
ORIGIN=https://example.com

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=user@gmail.com
SMTP_PASSWORD=app-password

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### Database Migrations

```bash
# Development
bun run drizzle-kit push:pg

# Production
bun run drizzle-kit migrate
```

---

## 9
