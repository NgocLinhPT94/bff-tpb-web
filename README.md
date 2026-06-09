# TPB Web BFF

[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey)](#license)

Backend-For-Frontend service for the TPBank corporate website (www.tpb.vn). Provides a secure API layer between the frontend and CMS/backend services, transforming complex responses into stable, frontend-friendly DTOs.

## Quick Start

### Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your CMS_API_TOKEN and other values

# 3. Start development server
pnpm start:dev

# API:     http://localhost:3001/api/v1
# Swagger: http://localhost:3001/api/docs
# Health:  http://localhost:3001/health
```

> **Requires**: CMS (Strapi) running at `http://localhost:1337`. See [tpb-web-cms](https://cicd.tpb.vn/gitlab/eb/web/tpb-vn/website-new/tpb-web-cms) for setup.

### Docker

```bash
# 1. Configure environment
cp .env.docker.example .env
# Edit .env — DB_HOST=postgres, REDIS_HOST=redis, CMS_BASE_URL=http://host.docker.internal:1337

# 2. Start all services (BFF + PostgreSQL + Redis)
docker compose up -d

# Follow logs
docker compose logs -f bff

# API:     http://localhost:3001/api/v1
# Swagger: http://localhost:3001/api/docs
# Health:  http://localhost:3001/health
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 22 | JavaScript runtime |
| Framework | NestJS 11 | HTTP framework, DI, modules |
| Language | TypeScript 5.7 | Type safety |
| Validation | class-validator | Request body validation |
| Documentation | @nestjs/swagger | OpenAPI/Swagger auto-generation |
| Security | Helmet, @nestjs/throttler | Headers, rate limiting |
| Logging | nestjs-pino | Structured JSON logging |
| Package Manager | pnpm 9 | Fast, disk-efficient |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────────────────┐
│   Next.js    │     │              │     │  Strapi CMS                  │
│   Frontend   │────►│  BFF (this)  │────►│  CRM                         │
│              │     │              │     │  Core Bank / SMS / reCAPTCHA  │
└──────────────┘     └──────────────┘     └──────────────────────────────┘
```

**Data flow:**

```
Request → Middleware (requestId, CORS, helmet)
        → Guard (rate limit, method check)
        → Controller (validate input, call service)
        → Service (call CMS/CRM client, map response)
        → Mapper (transform CMS entity → DTO)
        → Controller (wrap in SuccessEnvelopeDto)
        → Response
```

**Dependencies:**

| Service | Protocol | Port |
|---------|----------|------|
| Strapi CMS | HTTP | 1337 |
| PostgreSQL | TCP | 5433 (host) / 5432 (container) |
| Redis | TCP | 6379 |
| CRM | HTTP | 8081 |
| Core Bank | HTTP | 8080 |
| SMS Gateway | HTTP | 8082 |
| reCAPTCHA | HTTPS | 443 |

## Project Structure

```
src/
├── common/            # Cross-cutting: DTOs, filters, guards, middleware, utils
├── config/            # Environment validation and configuration
├── integrations/      # External service clients (CMS, CRM, Core Bank, SMS)
└── modules/           # Domain modules (19 modules)
    ├── articles/      # CMS content modules (13 modules)
    ├── products/
    ├── lead/          # Write operation modules (5 modules)
    ├── calculator/
    └── health/        # Infrastructure (1 module)
```

Each CMS module follows:

```
{module}/
├── {module}.module.ts         # NestJS module definition
├── {module}.controller.ts     # Route handlers + Swagger decorators
├── {module}.service.ts        # Business logic + CMS client calls
├── {module}.dto.ts            # Output DTO interfaces
├── {module}.mapper.ts         # CMS entity → DTO transformation
├── {module}.mapper.spec.ts    # Unit tests for mapper
└── {module}.swagger.dto.ts    # Swagger schema classes
```

## Development

### Prerequisites

- Node.js >= 22.0.0 (see `.nvmrc`)
- pnpm >= 9.0.0
- Running CMS instance (or use `docker compose up cms`)

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Development server with hot reload |
| `pnpm build` | Compile TypeScript |
| `pnpm lint` | ESLint check + fix |
| `pnpm format` | Prettier format |
| `pnpm test` | Unit tests |
| `pnpm test:cov` | Unit tests with coverage |
| `pnpm test:e2e` | End-to-end tests |
| `pnpm generate:openapi` | Generate OpenAPI spec |

### Configuration

Copy `.env.example` and fill in values:

```bash
cp .env.example .env
```

See [.env.example](./.env.example) for all available variables with descriptions. Validation rules are defined in `src/config/env.schema.ts`.

## Testing

```bash
pnpm test              # Unit tests (mappers, config, CMS client)
pnpm test:cov          # With coverage report
pnpm test:e2e          # Full HTTP stack with mocked CMS

# QA scripts (against live CMS)
node scripts/qa/live.mjs
node scripts/qa/security.mjs
```

## API Documentation

Interactive API documentation available at `/api/docs` (Swagger UI) when the server is running.

```bash
# Generate OpenAPI spec (JSON + YAML)
pnpm generate:openapi
```

### Response Format

All responses use a standardized envelope:

```jsonc
// Success (list)
{
  "data": [...],
  "meta": { "requestId": "uuid", "pagination": { "page": 1, "pageSize": 20, "pageCount": 5, "total": 100 } }
}

// Success (single)
{
  "data": { ... },
  "meta": { "requestId": "uuid" }
}

// Error
{
  "error": { "code": "NOT_FOUND", "message": "Not found", "requestId": "uuid" }
}
```

### HTTP Status Codes

| Status | Code | Scenario |
|--------|------|----------|
| 200 | OK | Successful request |
| 400 | BAD_REQUEST | Invalid parameters |
| 404 | NOT_FOUND | Resource not found |
| 405 | METHOD_NOT_ALLOWED | Non-GET on read-only endpoints |
| 429 | TOO_MANY_REQUESTS | Rate limit exceeded |
| 502 | BAD_GATEWAY | Upstream service unavailable |

## Security

| Control | Implementation |
|---------|---------------|
| Rate Limiting | `@nestjs/throttler` (100 req/60s default) |
| CORS | Configurable origin whitelist |
| Security Headers | Helmet.js (CSP, HSTS, X-Frame-Options) |
| Input Validation | class-validator (whitelist, forbidNonWhitelisted) |
| Error Sanitization | No stack traces in responses |
| Request Tracing | UUID per request (`x-request-id` header) |

## Deployment

```bash
# Development (docker compose)
docker compose up -d

# Production build
docker build -f Dockerfile.prod -t tpb-web-bff .
docker run -p 3001:3001 --env-file .env tpb-web-bff
```


## Contributing

### Branching Strategy: GitLab Flow

```
feature/* ──► main ──► sit ──► uat ──► pre-prod ──► prod ──► tag v*.*.*
```

### Conventional Commits

```
type(scope): description
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`

Scopes: `module`, `integration`, `common`, `config`, `dto`, `mapper`, `controller`, `service`, `deps`

### Module Development Checklist

1. Create folder in `src/modules/{module-name}/`
2. Each module needs: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`
3. CMS modules also need: `*.mapper.ts`, `*.mapper.spec.ts`, `*.swagger.dto.ts`
4. Service returns `{ data, pagination? }` for list endpoints
5. Controller uses `createSuccessEnvelope(request, data, pagination)`
6. DTO interfaces live in `*.dto.ts`, mapper only contains transform logic

### Code Conventions

- Response envelope: always use `createSuccessEnvelope` helper
- DTO imports: controller/service import from `*.dto.ts`, never from `*.mapper.ts`
- ApiTags: Title Case (`'Products'`, `'Customer Segments'`)
- ApiResponse: list endpoints need 200, 400, 429, 502; detail adds 404, 405
- Module exports: always export service

### Rules

- **DO NOT** commit `.env` — use `.env.example` as template
- **DO NOT** hardcode credentials — use environment variables
- **DO NOT** return raw CMS responses — always transform via mapper
- **DO NOT** import DTO types from mapper files — import from `*.dto.ts`

See [ADR-001](./docs/adr/0001-repository-strategy.md) and [ADR-002](./docs/adr/0002-branching-strategy.md) for architectural decisions.

## Related Projects

| Project | Description |
|---------|-------------|
| [tpb-web-frontend](https://cicd.tpb.vn/gitlab/eb/web/tpb-vn/website-new/tpb-web-frontend) | Next.js frontend (App Router, ISR) |
| [tpb-web-cms](https://cicd.tpb.vn/gitlab/eb/web/tpb-vn/website-new/tpb-web-cms) | Strapi v5 CMS |
| [tpb-web-shared-types](https://cicd.tpb.vn/gitlab/eb/web/tpb-vn/website-new/tpb-web-shared-types) | Shared TypeScript types |
| [tpb-web-infra](https://cicd.tpb.vn/gitlab/eb/web/tpb-vn/website-new/tpb-web-infra) | Infrastructure as Code |

## License

Proprietary — TPBank (Tien Phong Commercial Joint Stock Bank). See [LICENSE](./LICENSE).
