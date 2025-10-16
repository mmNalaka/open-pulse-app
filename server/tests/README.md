# Test Suite Documentation

This is a production-ready test suite supporting unit tests, integration tests, and e2e tests.

## Directory Structure

```
tests/
├── unit/              # Unit tests for individual functions/modules
├── integration/       # Integration tests for API endpoints and features
├── e2e/              # End-to-end tests (future)
├── fixtures/         # Test data and mocks
├── utils/            # Test utilities and helpers
├── setup.ts          # Global test setup
└── README.md         # This file
```

## Test Types

### Unit Tests (`tests/unit/`)
- Test individual functions, services, or utilities in isolation
- Use mocks for external dependencies
- Fast execution
- High coverage target

**Example:**
```typescript
import { describe, it, expect, vi } from "vitest";
import { myFunction } from "@/services/my-service";

describe("Unit: myFunction", () => {
  it("should return expected value", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });
});
```

### Integration Tests (`tests/integration/`)
- Test API endpoints and feature interactions
- Use test app with real routers
- May use test databases or mocked external services
- Moderate execution time

**Example:**
```typescript
import { describe, it, expect } from "vitest";
import { createUnitTestApp, makeRequest } from "../utils";
import myRouter from "@/modules/my-module/router";

describe("Integration: My Endpoint", () => {
  const app = createUnitTestApp(myRouter);

  it("should handle valid request", async () => {
    const res = await makeRequest(app, "/endpoint", {
      method: "POST",
      body: { data: "value" },
    });

    expect(res.status).toBe(200);
  });
});
```

### E2E Tests (`tests/e2e/`)
- Test complete user workflows
- Use full application stack
- May use test database with real data
- Slower execution

**Example:**
```typescript
import { describe, it, expect } from "vitest";
import { createIntegrationTestApp, makeRequest } from "../utils";

describe("E2E: User Registration Flow", () => {
  const app = createIntegrationTestApp();

  it("should complete user registration", async () => {
    // Test complete flow
  });
});
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run with UI
bun test:ui

# Run with coverage
bun test:coverage

# Run only unit tests
bun test tests/unit

# Run only integration tests
bun test tests/integration

# Run specific test file
bun test tests/integration/health.test.ts
```

## Test Utilities

### `createIntegrationTestApp()`
Creates a full app instance with all middlewares and routes for integration tests.

### `createUnitTestApp(router)`
Creates a test app with a specific router for isolated testing.

### `makeRequest(app, path, options)`
Helper to make HTTP requests in tests.

### `parseJsonResponse(response)`
Helper to parse JSON responses safely.

### Assertions
- `expectSuccessResponse(json)` - Assert successful API response
- `expectErrorResponse(json, expectedStatus)` - Assert error response
- `expectStatus(status, expected)` - Assert HTTP status
- `expectResponseStructure(json, keys)` - Assert response has expected keys

## Fixtures

### Test Data
Located in `tests/fixtures/test-data.ts`, provides reusable test data:
```typescript
import { testData } from "@tests/fixtures";

const payload = testData.validPageview;
```

### Mocks
Located in `tests/fixtures/mocks.ts`:
```typescript
import { createMockLogger, createMockContext } from "@tests/fixtures";

const logger = createMockLogger();
```

## Best Practices

1. **Naming**: Use descriptive test names that explain what is being tested
2. **Organization**: Group related tests using `describe` blocks
3. **Isolation**: Each test should be independent and not rely on others
4. **Cleanup**: Use `afterEach` hooks to clean up state
5. **Fixtures**: Use test data from fixtures for consistency
6. **Mocking**: Mock external dependencies to keep tests fast
7. **Coverage**: Aim for >70% coverage (configured in vitest.config.ts)

## Configuration

Vitest configuration is in `vitest.config.ts`:
- Test environment: Node
- Global setup: `tests/setup.ts`
- Test timeout: 10 seconds
- Coverage threshold: 70%

## CI/CD Integration

These test scripts can be integrated into CI/CD pipelines:
```bash
# Run tests with coverage for CI
bun test:coverage
```

Coverage reports are generated in `coverage/` directory.
