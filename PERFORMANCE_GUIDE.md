# Performance & Optimization Guide

### Frontend
- Code splitting via dynamic React imports.
- Virtualized lists for high-density sprint boards.
- Asset caching with Nginx 30-day immutable cache header.

### Backend
- Redis cache layer for API endpoints with custom TTL invalidation.
- Connection pooling for PostgreSQL with active monitoring.
- Sub-50ms API response target.
