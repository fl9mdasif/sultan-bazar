# Phase 2 API contracts

All endpoints return `{ success, message, data }`. Collection endpoints return pagination inside `data.meta`.

## Public catalog

- `GET /api/v1/products`: active products only. Supports `search` (maximum 100 characters), `category`, `isFeatured`, `minPrice`, `maxPrice`, `sort` (`newest`, `oldest`, `priceAsc`, `priceDesc`, `rating`), `page`, and `limit` (1–100).
- `GET /api/v1/categories`: active categories only. Supports `sort` (`newest`, `oldest`, `nameAsc`, `nameDesc`).

## Staff catalog

- `GET /api/v1/products/admin` and `GET /api/v1/categories/admin` require `admin` or `superAdmin`; they may request inactive/draft data.
- `POST /api/v1/uploads/generate-upload-url` requires `admin` or `superAdmin`; body is `{ filename, contentType, contentLength }`. Only JPEG, PNG, and WebP images up to 5 MB are accepted.

## Reviews

- `POST /api/v1/products/:productId/review` requires a customer token and body `{ rating, orderId, variantId, comment? }`.
- The order item must be delivered, belong to the caller, match the product and variant, and be unreviewed. Each customer can review a product once.

## Account retention

- A `superAdmin` may delete only users without orders. Accounts with order history must be blocked, retaining order records.
