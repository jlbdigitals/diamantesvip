# Backend Testing

## When to use this skill

- **New feature development**: Write tests first using TDD
- **Adding API endpoints**: Test success and failure cases for REST APIs
- **Bug fixes**: Add tests to prevent regressions
- **Before refactoring**: Write tests that guarantee existing behavior
- **CI/CD setup**: Build automated test pipelines

## Instructions

### Step 1: Set up the test environment
- Install test libraries (Jest, Supertest, etc.)
- Configure test database (in-memory or separate DB)
- Separate environment variables (.env.test)
- Configure jest.config.js or vitest.config.ts

### Step 2: Write Unit Tests (business logic)
- Test pure functions (no dependencies)
- Isolate dependencies via mocking
- Test edge cases (boundary values, exceptions)
- Follow AAA pattern (Arrange-Act-Assert)

### Step 3: Integration Test (API endpoints)
- Test HTTP requests/responses
- Success cases (200, 201)
- Failure cases (400, 401, 404, 500)
- Authentication/authorization tests
- Input validation tests

### Step 4: Authentication/Authorization Tests
- Test JWT tokens and role-based access control
- Confirm 401 without token
- Confirm access with valid token
- Test expired token handling
- Role-based permission tests

### Step 5: Mocking and Test Isolation
- Mock external APIs
- Mock email sending
- Mock file system
- Mock time-related functions

## Constraints

### Required
1. **Test isolation**: Each test runnable independently
2. **Clear test names**: e.g. 'should reject duplicate email'
3. **AAA pattern**: Arrange - Act - Assert structure

### Prohibited
1. **No production DB**: Use separate/in-memory DB
2. **No real external API calls**: Mock all external services
3. **No Sleep/Timeout abuse**: Use fake timers

### Security
- No hardcoded secrets in test code
- Use .env.test for test environment variables
