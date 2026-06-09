# BFF API Contract

This document defines the API contract for the BFF (Backend for Frontend) v1.

## Route Inventory

### CMS Content Endpoints (read-only)

#### Collection List + Detail Endpoints

All collection endpoints follow this pattern:

```
GET /api/v1/{collection}
GET /api/v1/{collection}/{documentId}
```

| Endpoint | List | Detail |
|----------|------|--------|
| `/api/v1/articles` | ✅ | ✅ |
| `/api/v1/authors` | ✅ | ✅ |
| `/api/v1/categories` | ✅ | ✅ |
| `/api/v1/products` | ✅ | ✅ |
| `/api/v1/product-categories` | ✅ | ✅ |
| `/api/v1/promotions` | ✅ | ✅ |
| `/api/v1/faqs` | ✅ | ✅ |
| `/api/v1/pages` | ✅ | ✅ |
| `/api/v1/navigations` | ✅ | ✅ |
| `/api/v1/navigation-items` | ✅ | ✅ |
| `/api/v1/tags` | ✅ | ✅ |

**List Allowed Query Parameters:**
- `page` (integer, >=1, default: 1)
- `pageSize` (integer, 1..50, default: 20)
- `sort` (enum, default: `publishedAt:desc`)

**Detail Allowed Query Parameters:** None

#### Singleton Endpoints

```
GET /api/v1/global
GET /api/v1/about
```

**Allowed Query Parameters:** None

---

### Write Operation Endpoints

#### Lead

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/lead` | Submit a lead form |

#### Calculator

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/calculator/loan` | Calculate loan payment |
| `POST` | `/api/v1/calculator/interest` | Calculate interest |

#### Rates

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/rates` | Get current interest rates |

#### OTP

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/otp/send` | Send OTP to phone number |
| `POST` | `/api/v1/otp/verify` | Verify OTP code |

#### Captcha

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/captcha/verify` | Verify reCAPTCHA token |

---

### Health Endpoints

> These are excluded from the `/api/v1` global prefix.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness probe |
| `GET` | `/health/ready` | Readiness probe |

---

## Success Response Envelope

```json
{
  "data": { ... },
  "meta": {
    "requestId": "uuid-v4-string",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 5,
      "total": 100
    }
  }
}
```

`pagination` is only included for list endpoints.

## Error Response Envelope

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "requestId": "uuid-v4-string"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid query parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `METHOD_NOT_ALLOWED` | 405 | Only GET allowed for CMS routes |
| `TOO_MANY_REQUESTS` | 429 | Rate limit exceeded |
| `BAD_GATEWAY` | 502 | CMS upstream error |
| `SERVICE_UNAVAILABLE` | 503 | CMS unreachable |
| `GATEWAY_TIMEOUT` | 504 | CMS request timed out |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Sort Enum Values

- `publishedAt:desc` (default)
- `publishedAt:asc`
- `createdAt:desc`
- `createdAt:asc`
- `updatedAt:desc`
- `updatedAt:asc`

## Pagination

- Maximum pageSize: 50
- Default pageSize: 20
- Default page: 1
- Indexing: 1-based

## Validation

Unknown query parameters return 400 (`forbidNonWhitelisted: true`).
