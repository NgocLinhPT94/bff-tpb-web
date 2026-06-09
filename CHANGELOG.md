# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial NestJS BFF project structure
- CMS content modules: articles, authors, categories, products, promotions, faqs, pages, navigation, navigation-items, global, about, customer-segments, product-categories
- Write operation modules: lead, calculator, captcha, otp, rates
- Health check endpoints (liveness + readiness probes)
- Standardized response envelope (SuccessEnvelopeDto / ErrorEnvelopeDto)
- CMS client integration with Strapi v5
- CRM client integration (lead fan-out)
- Global exception filter with structured error responses
- Request ID middleware for tracing
- Rate limiting via @nestjs/throttler
- CORS configuration
- Preview/draft mode support (articles, pages)
- OpenAPI/Swagger documentation at /api/docs
- Documentation set: README, CHANGELOG
- ADR-001: Repository Strategy (Poly_Repo)
- ADR-002: Branching Strategy (GitLab Flow)
