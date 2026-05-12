# BFF TPBank Web API

Backend for Frontend (BFF) service for the TPBank website. This NestJS application provides a secure, read-only API layer between the frontend and Strapi CMS, simplifying complex CMS responses into stable, frontend-friendly DTOs.

## Table of Contents

- [Purpose](#purpose)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Conventions](#code-conventions)
- [API Contract](#api-contract)
- [Security Model](#security-model)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Purpose

The BFF acts as a dedicated backend for the TPBank frontend applications. Its primary responsibilities are:

1. **Simplify CMS Responses**: Transform complex Strapi v5 responses into clean, stable DTOs
2. **Enforce Security**: Implement OWASP-compliant security controls (rate limiting, CORS, input validation)
3. **Stabilize API Contract**: Shield frontend from CMS schema changes through versioned DTOs
4. **Optimize for Frontend**: Return only fields the frontend needs, with consistent envelope formatting

### Why BFF Pattern?

- **Decoupling**: Frontend is insulated from Strapi API changes
- **Security**: No direct CMS access from browser; all requests go through controlled BFF layer
- **Performance**: Response shaping reduces payload size
- **Maintainability**: Centralized business logic for content transformation

## Architecture

```
Frontend (React/Vue)          BFF (NestJS)                Strapi CMS
     |                            |                            |
     |  GET /api/v1/articles      |                            |
     |--------------------------->|                            |
     |                            |  GET /api/articles         |
     |                            |--------------------------->|
     |                            |                            |
     |                            |  { data: [...], meta }     |
     |                            |<---------------------------|
     |                            |                            |
     |  { data: [...], meta }     |                            |
     |<---------------------------|                            |
```

### Layered Architecture

```
src/
├── main.ts                 # Application bootstrap
├── app.module.ts           # Root module composition
├── common/                 # Cross-cutting concerns
│   ├── dto/               # Response envelopes
│   ├── filters/           # Exception handling
│   ├── guards/            # Method guards
│   ├── interceptors/      # Request logging
│   ├── middleware/        # Request ID tracking
│   ├── query/             # Query validation DTOs
│   └── swagger/           # Swagger documentation DTOs
├── config/                 # Environment configuration
│   ├── app.config.ts      # App-level config
│   ├── security.config.ts # Security settings
│   ├── strapi.config.ts   # CMS connection
│   └── validation.ts      # Env validation schema
├── infrastructure/         # External integrations
│   └── strapi/
│       ├── strapi.client.ts    # HTTP client wrapper
│       ├── strapi.module.ts    # Module definition
│       └── generated/          # Auto-generated types
└── modules/               # Domain modules
    ├── about/
    ├── articles/
    ├── authors/
    ├── categories/
    ├── faqs/
    ├── global/
    ├── navigation/
    ├── navigation-item/
    ├── pages/
    ├── products/
    ├── promotions/
    └── shared/            # Shared mapper utilities
```

### Module Pattern

Each domain module follows this structure:

```
modules/{domain}/
├── {domain}.module.ts       # NestJS module
├── {domain}.controller.ts   # Route handlers
├── {domain}.service.ts      # Business logic
├── {domain}.mapper.ts       # DTO transformation
├── {domain}.dto.ts          # TypeScript interfaces
├── {domain}.swagger.dto.ts  # Swagger decorators
└── {domain}.mapper.spec.ts  # Unit tests
```

## Project Structure

```
bff-tpb-web/
├── src/                        # Source code
│   ├── main.ts                # Application entry
│   ├── app.module.ts          # Root module
│   ├── common/                # Shared utilities
│   ├── config/                # Configuration
│   ├── infrastructure/        # External clients
│   └── modules/               # Domain modules
├── test/                       # E2E tests
│   ├── app.e2e-spec.ts
│   ├── fixtures/              # Test fixtures
│   └── jest-e2e.json
├── scripts/                    # Utility scripts
│   ├── qa/                    # QA automation
│   └── verify-cms-openapi.mjs
├── docs/                       # Documentation
│   └── api-contract.md
├── .env.example               # Environment template
├── .env                       # Local environment (gitignored)
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── eslint.config.mjs
```

## Prerequisites

- **Node.js**: 20.x - 24.x (specified in `engines`)
- **npm**: 10+
- **Strapi CMS**: Running instance at `cms-tpb-web` sibling directory
- **PostgreSQL**: Required by Strapi CMS (configured separately)

## Environment Setup

### 1. Install Dependencies

```bash
cd bff-tpb-web
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your local values:

```env
# Server
PORT=3000
NODE_ENV=development

# Strapi CMS Connection
STRAPI_BASE_URL=http://localhost:1337/api
STRAPI_API_TOKEN=your_strapi_api_token_here

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=120

# Strapi Client
STRAPI_TIMEOUT_MS=5000
STRAPI_RETRY_ATTEMPTS=1

# Swagger
ENABLE_SWAGGER=true
```

### 3. Start Strapi CMS

The BFF requires a running Strapi CMS instance:

```bash
cd ../cms-tpb-web
npm install
npm run develop
```

Wait for Strapi to start at `http://localhost:1337`.

### 4. Obtain Strapi API Token

1. Open Strapi Admin: `http://localhost:1337/admin`
2. Go to **Settings > API Tokens > Create new API Token**
3. Name: `BFF Read Only`
4. Token type: `Custom`
5. Permissions: Select all content types with **find** and **findOne** actions
6. Copy the generated token to your `.env` file

### 5. Build and Run

```bash
# Build the project
npm run build

# Development mode (hot reload)
npm run start:dev

# The API is available at:
# http://localhost:3000/api/v1
# Swagger UI: http://localhost:3000/api/docs
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | HTTP server port |
| `NODE_ENV` | No | `development` | `development`, `production`, `test` |
| `STRAPI_BASE_URL` | Yes | - | Strapi API base URL (must end with `/api`) |
| `STRAPI_API_TOKEN` | Yes* | - | Strapi API token for authenticated CMS requests |
| `CORS_ORIGINS` | No | `http://localhost:3000,http://localhost:5173` | Comma-separated allowed origins |
| `THROTTLE_TTL_MS` | No | `60000` | Rate limit window (ms) |
| `THROTTLE_LIMIT` | No | `120` | Max requests per window |
| `STRAPI_TIMEOUT_MS` | No | `5000` | CMS request timeout |
| `STRAPI_RETRY_ATTEMPTS` | No | `1` | Retry attempts for transient failures |
| `ENABLE_SWAGGER` | No | `false` | Force-enable Swagger in production |

*Required if Strapi has public API access disabled (default in v5).

### Validation

All environment variables are validated at startup using Joi schema. The application will refuse to start with a clear error message if required variables are missing or invalid.

## Development Workflow

### Available Scripts

```bash
# Development
npm run start:dev          # Hot reload development server
npm run start:debug        # Debug mode with inspector
npm run start:prod         # Production mode (requires build)

# Building
npm run build              # Compile TypeScript

# Code Quality
npm run lint               # ESLint check
npm run format             # Prettier format
npm run format:check       # Prettier check (CI)

# Testing
npm test                   # Unit tests
npm run test:watch         # Unit tests (watch mode)
pm run test:cov           # Unit tests with coverage
npm run test:e2e          # End-to-end tests

# CMS Integration
npm run generate:cms       # Full regeneration (spec + types)
npm run generate:cms:spec  # Generate OpenAPI spec from Strapi
npm run generate:cms:types # Generate TypeScript types from spec

# QA
npm run qa:live           # Live integration tests (starts CMS + BFF)
npm run qa:security       # Security smoke tests
```

### Regenerating CMS Types

When Strapi content models change:

```bash
# Option 1: Full regeneration
npm run generate:cms

# Option 2: Step by step
cd ../cms-tpb-web && npm run generate:api
cd ../bff-tpb-web && npm run generate:cms:types
```

This updates `src/infrastructure/strapi/generated/cms-schema.d.ts`.

## Testing

### Test Strategy

The project uses a three-tier testing approach:

1. **Unit Tests**: Mapper functions, config validation, Strapi client behavior
2. **Integration Tests**: Controller + Service + mocked Strapi client
3. **E2E Tests**: Full HTTP stack with mocked upstream

### Running Tests

```bash
# Unit tests (fast, no external dependencies)
npm test

# Unit tests with coverage
npm run test:cov

# E2E tests (full HTTP stack)
npm run test:e2e

# All tests (CI pipeline)
npm test && npm run test:e2e
```

### Test Fixtures

Strapi response fixtures are stored in `test/fixtures/strapi/`. When adding new content types, create corresponding fixture files for consistent test data.

### QA Scripts

For integration testing against a live CMS:

```bash
# Requires CMS to be accessible and STRAPI_API_TOKEN configured
npm run qa:live
npm run qa:security
```

Evidence is written to `.sisyphus/evidence/`.

## Code Conventions

### General Principles

1. **Functional Mappers**: Mapper functions must be pure functions with no side effects
2. **Explicit Types**: No `any` types. All functions must have explicit return types
3. **Null Safety**: Always handle `null`/`undefined` in mappers and services
4. **Immutability**: Never mutate input objects; always return new objects

### Naming Conventions

```typescript
// Files
{domain}.controller.ts     // PascalCase for class file
{domain}.service.ts
{domain}.mapper.ts
{domain}.dto.ts
{domain}.swagger.dto.ts
{domain}.mapper.spec.ts

// Classes
ArticlesController         // PascalCase
ArticlesService
ArticlesMapper             // (static functions, no class)

// Interfaces
ArticleDto                 // PascalCase + Dto suffix
ArticleStrapiEntity        // PascalCase + StrapiEntity suffix

// Functions
mapArticle()               // camelCase
findAll()                  // camelCase
buildRequestMeta()         // camelCase, descriptive

// Constants
ARTICLES_POPULATE_PARAMS   // UPPER_SNAKE_CASE
```

### DTO Mapping Rules

1. **Strip Internal Fields**: Remove `id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `permissions`
2. **Keep `documentId`**: Use Strapi v5's `documentId` as the public identifier
3. **Media Fields**: Map to `{ url, alternativeText, width, height, formats }` only
4. **Relations**: Map to `{ documentId, name, title, ... }` summary objects
5. **Back-references**: Strip circular arrays (e.g., `articles` from `author`)

### Controller Patterns

```typescript
// Collection routes accept ListQueryDto
@Get()
async findAll(
  @Query() query: ListQueryDto,
  @Req() request: RequestWithId,
): Promise<SuccessEnvelopeDto<ArticleDto[]>>

// Detail routes accept EmptyQueryDto (rejects all query params)
@Get(':documentId')
async findOne(
  @Param('documentId') documentId: string,
  @Query() _query: EmptyQueryDto,
  @Req() request: RequestWithId,
): Promise<SuccessEnvelopeDto<ArticleDto>>
```

### Service Patterns

```typescript
// List services return data + pagination
async findAll(query: ListQueryDto): Promise<{ data: T[]; pagination?: PaginationMeta }>

// Detail services throw NotFoundException for missing data
async findOne(documentId: string): Promise<T> {
  const response = await this.strapiClient.get<StrapiSingleResponse<T>>(`/articles/${documentId}`);
  if (!response.data) {
    throw new NotFoundException();
  }
  return mapper(response.data);
}
```

### Error Handling

- **Upstream 404**: Maps to BFF 404
- **Upstream 5xx**: Maps to BFF 502 (Bad Gateway)
- **Validation errors**: Maps to BFF 400
- **Rate limit**: Maps to BFF 429
- **All errors**: Sanitized to `{ error: { code, message, requestId } }`

## API Contract

### Base URL

```
http://localhost:3000/api/v1
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/global` | Global site settings |
| `GET` | `/api/v1/about` | About page content |
| `GET` | `/api/v1/articles` | List articles |
| `GET` | `/api/v1/articles/:documentId` | Single article |
| `GET` | `/api/v1/authors` | List authors |
| `GET` | `/api/v1/authors/:documentId` | Single author |
| `GET` | `/api/v1/categories` | List categories |
| `GET` | `/api/v1/categories/:documentId` | Single category |
| `GET` | `/api/v1/faqs` | List FAQs |
| `GET` | `/api/v1/faqs/:documentId` | Single FAQ |
| `GET` | `/api/v1/navigations` | List navigation structures |
| `GET` | `/api/v1/navigations/:documentId` | Single navigation |
| `GET` | `/api/v1/navigation-items` | List navigation items |
| `GET` | `/api/v1/navigation-items/:documentId` | Single navigation item |
| `GET` | `/api/v1/pages` | List pages |
| `GET` | `/api/v1/pages/:documentId` | Single page |
| `GET` | `/api/v1/products` | List products |
| `GET` | `/api/v1/products/:documentId` | Single product |
| `GET` | `/api/v1/promotions` | List promotions |
| `GET` | `/api/v1/promotions/:documentId` | Single promotion |

### Query Parameters

**Collection Routes** (`/articles`, `/authors`, etc.):

| Param | Type | Default | Constraints |
|-------|------|---------|-------------|
| `page` | integer | `1` | `>= 1` |
| `pageSize` | integer | `20` | `1..50` |
| `sort` | enum | `publishedAt:desc` | `publishedAt:desc`, `publishedAt:asc`, `createdAt:desc`, `createdAt:asc`, `updatedAt:desc`, `updatedAt:asc` |

**Singleton/Detail Routes**: No query parameters allowed. Unknown params return `400`.

### Response Envelope

**Success (List)**:
```json
{
  "data": [...],
  "meta": {
    "requestId": "uuid",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 5,
      "total": 100
    }
  }
}
```

**Success (Single)**:
```json
{
  "data": { ... },
  "meta": {
    "requestId": "uuid"
  }
}
```

**Error**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "requestId": "uuid"
  }
}
```

### HTTP Status Codes

| Status | Code | Scenario |
|--------|------|----------|
| 200 | OK | Successful GET |
| 400 | BAD_REQUEST | Invalid query parameters |
| 404 | NOT_FOUND | Resource not found |
| 405 | METHOD_NOT_ALLOWED | Non-GET request |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 502 | BAD_GATEWAY | CMS unavailable or error |

## Security Model

### GET-Only API

All business endpoints accept only `GET` requests. Non-GET requests receive `405 Method Not Allowed`:

```json
{
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Method not allowed",
    "requestId": "..."
  }
}
```

### OWASP Controls

| Control | Implementation | Evidence |
|---------|---------------|----------|
| **Rate Limiting** | `@nestjs/throttler` - 120 req/min per IP | `X-RateLimit-*` headers |
| **CORS** | Configurable origin whitelist | `Access-Control-Allow-Origin` |
| **Security Headers** | Helmet.js (CSP, HSTS, X-Frame-Options, etc.) | Response headers |
| **Input Validation** | `class-validator` with `whitelist: true, forbidNonWhitelisted: true` | 400 for invalid params |
| **Error Sanitization** | Production hides internal details | No stack traces in prod |
| **Request ID** | UUID per request for tracing | `x-request-id` header |
| **Token Redaction** | Auth headers redacted from logs | Pino `redact` config |

### Public Read Access

The BFF is designed for public content consumption:
- No authentication required for API consumers
- Content permissions managed in Strapi CMS
- Optional `STRAPI_API_TOKEN` for authenticated CMS reads (recommended)

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `STRAPI_BASE_URL` to production CMS
- [ ] Set `STRAPI_API_TOKEN` with read-only permissions
- [ ] Configure `CORS_ORIGINS` with exact production frontend URLs
- [ ] Disable Swagger or set `ENABLE_SWAGGER=false`
- [ ] Configure rate limiting (`THROTTLE_LIMIT`, `THROTTLE_TTL_MS`)
- [ ] Set up health check endpoint (`GET /api/docs-json` or custom)
- [ ] Configure logging aggregation (Pino logs to stdout)

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/main"]
```

### PM2 (Recommended for Production)

```bash
npm install -g pm2
pm2 start dist/main.js --name bff-tpb-web
```

## Troubleshooting

### Build Errors

**Error**: `Cannot find module '...'`

```bash
rm -rf node_modules dist
npm install
npm run build
```

### CMS Connection Issues

**Error**: `Bad gateway - CMS unavailable` (502)

1. Verify Strapi is running:
   ```bash
   curl http://localhost:1337/admin
   ```

2. Check `.env` configuration:
   ```bash
   cat .env | grep STRAPI
   ```

3. Test direct CMS API access:
   ```bash
   curl -H "Authorization: Bearer $STRAPI_API_TOKEN" \
        $STRAPI_BASE_URL/articles
   ```

4. Check CMS logs for authentication errors

### Type Generation Fails

**Error**: `Cannot find ../cms-tpb-web/docs/api-spec.json`

```bash
cd ../cms-tpb-web
npm run generate:api
cd ../bff-tpb-web
npm run generate:cms:types
```

### Port Conflicts

**Error**: `EADDRINUSE: address already in use :::3000`

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run start:dev
```

### Rate Limiting in Development

**Error**: `429 Too Many Requests`

```bash
# Temporarily increase limits (revert before committing)
THROTTLE_LIMIT=1000 npm run start:dev
```

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

Add your frontend origin:
```bash
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

## License

UNLICENSED - Private codebase for TPBank.
