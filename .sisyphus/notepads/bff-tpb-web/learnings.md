# BFF TPBank Web Learnings

## Task 9: Swagger/OpenAPI Documentation

### Completed Work

1. **Swagger Configuration**
   - Added `ENABLE_SWAGGER` to environment validation schema (`src/config/validation.ts`)
   - Updated app config to include `enableSwagger` property
   - Configured Swagger in `main.ts` with conditional enabling:
     - Swagger UI available at `/api/docs`
     - Raw JSON spec at `/api/docs-json`
     - Only enabled when `NODE_ENV !== 'production'` OR `ENABLE_SWAGGER=true`

2. **DTO Documentation**
   - Added `@ApiProperty()` decorators to all common DTOs:
     - `SuccessEnvelopeDto` - Response wrapper with data and meta
     - `ErrorEnvelopeDto` - Error wrapper with code, message, requestId
     - `RequestMetaDto` - Metadata including requestId and pagination
     - `PaginationMeta` - Pagination information (page, pageSize, pageCount, total)
   - Added `@ApiPropertyOptional()` to query DTOs:
     - `ListQueryDto` - Combined pagination and sort parameters
     - `PaginationQueryDto` - Page and pageSize parameters
     - `SortQueryDto` - Sort ordering options

3. **Domain DTO Classes**
   - Created Swagger-specific DTO classes for all domains:
     - `ArticleDto`, `AuthorDto`, `CategoryDto`
     - `ProductDto`, `PromotionDto`, `FaqDto`
     - `PageDto`, `NavigationDto`, `NavigationItemDto`
     - `GlobalDto`, `AboutDto`
   - Created shared DTOs in `common/swagger/`:
     - `MediaSummaryDto` - Image/file metadata
     - `RelationSummaryDto` - Entity references
     - `SeoDto`, `LinkDto`, `ButtonDto`

4. **Controller Documentation**
   - Added `@ApiTags()` to all controllers for grouping
   - Added `@ApiOperation({ summary: '...' })` to all routes
   - Added `@ApiResponse()` decorators for:
     - 200 success with envelope response
     - 400 bad request (invalid query params)
     - 404 not found
     - 405 method not allowed
     - 429 too many requests
     - 502 bad gateway
   - Added `@ApiQuery()` for list endpoints with pagination
   - Added `@ApiParam()` for documentId parameters

5. **README Documentation**
   - Created comprehensive `README.md` with:
     - Project description and architecture overview
     - Prerequisites (Node 20+, npm)
     - Local setup commands
     - Instructions to run cms-tpb-web first
     - Instructions to run BFF with `npm run start:dev`
     - How to regenerate CMS spec/types with `npm run generate:cms`
     - Environment variables table
     - Security model summary (GET-only, public read, OWASP controls)
     - API versioning explanation (`/api/v1`)
     - No-cache v1 decision explanation
     - Troubleshooting section

### Patterns and Conventions

1. **Swagger DTO Organization**
   - Separate Swagger DTO files with `.swagger.dto.ts` suffix
   - Placed alongside mapper files in each module
   - Use `@ApiPropertyOptional()` for optional fields
   - Use `@ApiProperty()` for required fields
   - Include examples and descriptions for all properties

2. **Controller Decorator Pattern**
   - `@ApiTags('Name')` at controller class level
   - `@ApiOperation({ summary: '...' })` on each method
   - Multiple `@ApiResponse()` decorators for different status codes
   - Use `type: () => DtoClass` for generic response types
   - Import both runtime DTOs and Swagger DTOs (type-only imports)

3. **Conditional Swagger Enabling**
   ```typescript
   if (!appConfig.isProduction || appConfig.enableSwagger) {
     // Setup Swagger
   }
   ```

### Verification Results

- `npm run build` - PASSED
- `npm run lint` on src/ files - PASSED (test file errors are pre-existing)
- All Swagger DTOs properly typed
- All controllers decorated
- All query parameters documented

### Files Modified/Created

**Modified:**
- `src/main.ts` - Swagger setup
- `src/config/validation.ts` - ENABLE_SWAGGER env var
- `src/config/app.config.ts` - enableSwagger config
- `src/common/dto/SuccessEnvelopeDto.ts` - @ApiProperty
- `src/common/dto/ErrorEnvelopeDto.ts` - @ApiProperty
- `src/common/dto/RequestMetaDto.ts` - @ApiProperty, PaginationMeta class
- `src/common/query/ListQueryDto.ts` - @ApiPropertyOptional
- `src/common/query/PaginationQueryDto.ts` - @ApiPropertyOptional
- `src/common/query/SortQueryDto.ts` - @ApiPropertyOptional
- All 12 controllers - @ApiTags, @ApiOperation, @ApiResponse

**Created:**
- `src/common/swagger/common.swagger.dto.ts`
- `src/modules/*/ *.swagger.dto.ts` (11 files)
- `README.md`
