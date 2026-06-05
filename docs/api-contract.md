# BFF API Contract

This document defines the API contract for the BFF (Backend for Frontend) v1.

## Route Inventory

### Collection List Endpoints

All collection list endpoints follow this pattern:

```
GET /api/v1/{collection}
```

**Example:**
- `GET /api/v1/articles`
- `GET /api/v1/pages`

**Allowed Query Parameters:**
- `page` (integer, >=1, default: 1) - Page number for pagination
- `pageSize` (integer, 1..50, default: 20) - Number of items per page
- `sort` (enum) - Sort order for results

### Single Item Endpoints

```
GET /api/v1/{collection}/{slug}
```

**Example:**
- `GET /api/v1/articles/my-article-slug`

**Allowed Query Parameters:** None (path-based lookup only)

## Success Response Envelope

All successful responses follow this envelope structure:

```json
{
  "data": {
    // Resource data (flattened, no Strapi wrapper)
  },
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

### Pagination Meta

When a list endpoint is called, the `pagination` object is included:

| Field | Type | Description |
|-------|------|-------------|
| `page` | integer | Current page number (1-indexed) |
| `pageSize` | integer | Number of items per page |
| `pageCount` | integer | Total number of pages |
| `total` | integer | Total number of items across all pages |

### Single Item Meta

For single item endpoints, the `pagination` field is omitted:

```json
{
  "data": { /* resource */ },
  "meta": {
    "requestId": "uuid-v4-string"
  }
}
```

## Error Response Envelope

All error responses follow this envelope structure:

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
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Query Allowlist

### Allowed Query Parameters

Only the following query parameters are allowed in v1:

| Parameter | Type | Constraints | Default | Applies To |
|-----------|------|-------------|---------|------------|
| `page` | integer | >= 1 | 1 | List endpoints only |
| `pageSize` | integer | 1..50 | 20 | List endpoints only |
| `sort` | enum | See below | varies | List endpoints only |

### Sort Enum Values

Allowed sort values for list endpoints:

- `publishedAt:desc` - Most recently published first
- `publishedAt:asc` - Oldest published first
- `createdAt:desc` - Most recently created first
- `createdAt:asc` - Oldest created first
- `updatedAt:desc` - Most recently updated first
- `updatedAt:asc` - Oldest updated first

Default sort: `publishedAt:desc`

## Pagination Defaults

### BFF v1 Pagination Limits

- **Maximum pageSize:** 50
- **Default pageSize:** 20
- **Default page:** 1
- **Indexing:** 1-based (first page is page 1)

### Strapi v5 Mapping

The BFF maps Strapi v5's response to the BFF envelope:

**Strapi v5 Response:**
```json
{
  "data": [ /* items */ ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "pageCount": 5,
      "total": 100
    }
  }
}
```

**BFF Response:**
```json
{
  "data": [ /* flattened items */ ],
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

## DTO Mapping Rules

### Request DTOs

1. **PaginationQueryDto**
   - `page`: `@IsInt()`, `@Min(1)`, `@IsOptional()`, default: 1
   - `pageSize`: `@IsInt()`, `@Min(1)`, `@Max(50)`, `@IsOptional()`, default: 20
   - Both use `@Type(() => Number)` for query param transformation

2. **SortQueryDto**
   - `sort`: `@IsEnum(SortOption)`, `@IsOptional()`
   - Enum values: `publishedAt:desc`, `publishedAt:asc`, `createdAt:desc`, `createdAt:asc`, `updatedAt:desc`, `updatedAt:asc`

3. **ListQueryDto**
   - Extends both `PaginationQueryDto` and `SortQueryDto`
   - Used for all collection list endpoints

### Response DTOs

1. **RequestMetaDto**
   - `requestId`: string (UUID v4)
   - `pagination?`: optional pagination object

2. **SuccessEnvelopeDto<T>**
   - Generic wrapper with `data: T`
   - `meta: RequestMetaDto`

3. **ErrorEnvelopeDto**
   - `error.code`: string error code
   - `error.message`: string error message
   - `error.requestId`: string UUID

## Mapper Input Types

Mapper functions accept CMS entities that are generated from the Strapi OpenAPI spec rather than handwritten types.

- Generated models live in `src/infrastructure/strapi/generated/`
- The facade at `src/infrastructure/strapi/cms-types.ts` exports stable aliases such as `CmsArticle`, `CmsPage`, and `CmsMedia`
- Mappers should import these facade aliases with type-only imports
- When the CMS schema changes, regenerate types with `npm run generate:cms` and update the facade if new aliases are needed

## Media Mapping

Media files are transformed from Strapi's nested structure to a flat URL-based structure:

**Strapi v5 Format:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "url": "/uploads/image.jpg",
      "alternativeText": "Description"
    }
  }
}
```

**BFF Format:**
```json
{
  "url": "https://cms.example.com/uploads/image.jpg",
  "alt": "Description"
}
```

### Media Object Fields

| BFF Field | Source | Notes |
|-----------|--------|-------|
| `url` | `data.attributes.url` | Full URL with base URL prepended |
| `alt` | `data.attributes.alternativeText` | Renamed from alternativeText |
| `width` | `data.attributes.width` | Optional |
| `height` | `data.attributes.height` | Optional |

## Relation Mapping

Relations are transformed to include only essential fields:

**Strapi v5 Format:**
```json
{
  "data": [
    { "id": 1, "attributes": { "title": "Related Item" } }
  ]
}
```

**BFF Format:**
```json
[
  { "id": 1, "title": "Related Item" }
]
```

Relations are flattened and attributes are merged to the top level.

## Forbidden v1 Features

The following Strapi v4/v5 features are NOT supported in BFF v1:

### Query Parameters (Return 400)

Any request with these parameters will receive a `400 Bad Request` response:

| Parameter | Reason | Example Error |
|-----------|--------|---------------|
| `filters` | Not supported in v1 | Use client-side filtering |
| `populate` | Relations auto-populated based on content type | N/A |
| `fields` | All fields returned by default | N/A |
| `publicationState` | Only published content served | N/A |
| `status` | Only published content served | N/A |
| `locale` | Multi-language not yet supported | Will be added in future version |
| `token` | Use Authorization header instead | N/A |

### Response Features

| Feature | Status | Notes |
|---------|--------|-------|
| Draft content | Not supported | Only `published` status returned |
| Localization | Not supported | Default locale only |
| Dynamic zones | Limited | Specific transforms per content type |
| Component nesting | Limited | Flattened where possible |

### Example 400 Response for Forbidden Params

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Unknown query parameter: 'filters'. Allowed parameters: page, pageSize, sort",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## Validation Behavior

The BFF uses NestJS ValidationPipe with the following configuration:

```typescript
ValidationPipe({
  whitelist: true,              // Strip unknown properties
  forbidNonWhitelisted: true,   // Throw error for unknown properties
  transform: true,              // Auto-transform types
})
```

This means:
1. Unknown query parameters will result in a 400 error
2. Type coercion happens automatically (e.g., string "1" becomes number 1)
3. Invalid values trigger validation errors with detailed messages
