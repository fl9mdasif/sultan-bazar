# Plan: Migrate Image Uploads from imgBB → Cloudinary

## Context

### Current state
| Layer | What happens today |
|---|---|
| Client upload helper | `helpers/imgbb.uploads.ts` — compresses to ≤200 KB then POSTs to imgBB API |
| Callers (3 files) | `product.modal.tsx`, `category.modal.tsx`, `ProfileUpdateModal.tsx` each call `uploadToImgBB()` |
| Server upload route | `POST /api/v1/uploads/generate-upload-url` — generates an **S3** presigned URL (never called by the client; dead-end) |
| Server config | `config/index.ts` already reads `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` (Cloudinary creds pre-wired, unused) |

### Target state
| Layer | After migration |
|---|---|
| Client upload helper | `helpers/cloudinary.uploads.ts` — same compression, then uploads directly to Cloudinary unsigned endpoint |
| Callers | Same 3 files, import `uploadToCloudinary` instead |
| Server upload route | Rewritten to use `cloudinary` SDK (server-side upload); removes all AWS SDK code |
| Env vars | Client: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`; Server: existing `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` |

### Why direct upload from client?
Cloudinary supports **unsigned upload presets** — the browser sends the file directly to `https://api.cloudinary.com/v1_1/<cloud>/image/upload` with just the cloud name and an upload preset. No server round-trip needed for the three admin/profile flows. The server endpoint (Task 3) is rewritten for any future server-triggered upload path and to remove dead S3 code.

---

## Image size targets (compression)

| Use case | Max dimension | Target range | Rationale |
|---|---|---|---|
| Product thumbnail | 1000 × 1000 px | 80–200 KB | Largest rendered at ~600 px; Cloudinary transforms further on delivery |
| Category thumbnail | 800 × 600 px | 60–150 KB | Rendered at ~400 px wide |
| Profile picture | 400 × 400 px | 30–80 KB | Avatar, usually ≤100 px rendered |

The existing compression function already handles size targets; we pass per-use-case `maxDimension` and `targetMaxKB` params.

---

## Dependency graph

```
Task 1 (client helper)
    └── Task 2 (update 3 callers)       ← depends on Task 1
Task 3 (server controller rewrite)      ← independent of Tasks 1–2
Task 4 (env / config docs)              ← documents outputs of Tasks 1 and 3
Task 5 (delete imgbb file + cleanup)    ← after Task 2 confirmed working
```

---

## Task 1 — Create Cloudinary client upload helper

**File:** `sultan-bazar-client/helpers/cloudinary.uploads.ts`

Replace the imgBB upload call in `helpers/imgbb.uploads.ts` with a Cloudinary unsigned upload. Keep the existing Canvas-API compression function verbatim (no logic change, just move it).

### What to build
- Export `uploadToCloudinary(file: File, preset?: CloudinaryPreset): Promise<string>`
- `CloudinaryPreset` = `'product' | 'category' | 'avatar'`
- Each preset maps to its own `maxDimension` / `targetMaxKB` values (see table above)
- After compression, POST to `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload` with `upload_preset` and `file` fields
- Return `secure_url` from the response
- Read cloud name from `process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- Read upload preset name from `process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Acceptance criteria
- `uploadToCloudinary` resolves with a valid `https://res.cloudinary.com/...` URL when given a real image file and valid env vars
- Throws a typed `Error` (not `alert`) if the env var is missing or the upload fails
- No imgBB references in the new file
- TypeScript compiles with no errors (`npm run build` in `sultan-bazar-client/`)

### Verification
1. `npm run build` in `sultan-bazar-client/` passes (no new TS errors)
2. Manual test: upload a product image in admin dashboard → URL in form field starts with `res.cloudinary.com`

---

## Task 2 — Update all three callers

**Files:**
- `sultan-bazar-client/app/dashboard/admin/products/product.modal.tsx`
- `sultan-bazar-client/app/dashboard/admin/categories/category.modal.tsx`
- `sultan-bazar-client/components/dashboard/ProfileUpdateModal.tsx`

### What to change in each file
1. Replace `import { uploadToImgBB } from "@/helpers/imgbb.uploads"` → `import { uploadToCloudinary } from "@/helpers/cloudinary.uploads"`
2. Replace `uploadToImgBB(file)` call with `uploadToCloudinary(file, '<preset>')`:
   - `product.modal.tsx` → `'product'`
   - `category.modal.tsx` → `'category'`
   - `ProfileUpdateModal.tsx` → `'avatar'`
3. No other logic changes — error handling, loading state, field update are unchanged

### Acceptance criteria
- Zero references to `imgbb` in the three files
- UI behavior is identical: drag/drop, click-to-upload, loading spinner, error toast all still work
- `npm run build` passes

### Verification
1. `npm run build` in `sultan-bazar-client/` passes
2. `grep -r "imgbb" sultan-bazar-client/app/dashboard sultan-bazar-client/components/dashboard` returns empty

---

## Task 3 — Rewrite server upload controller to use Cloudinary

**Files:**
- `sultan-bazar-server/src/app/modules/upload/controller.upload.ts` (rewrite)
- `sultan-bazar-server/package.json` (add `cloudinary`, remove `@aws-sdk/*`)
- `sultan-bazar-server/.env.example` (update)

### What to build
- Install `cloudinary` package (v2 SDK); remove `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
- Rewrite `generateUploadUrl` controller to:
  - Validate `contentType` (JPEG, PNG, WebP) and `contentLength` (≤ 5 MB) — same constraints
  - Use `cloudinary.v2.uploader.upload_stream()` **or** return a Cloudinary signed upload URL/params (server-signed, client posts directly)
  - Preferred approach: **server returns a signed upload signature** so client can upload directly without proxying the binary through Express
  - Response shape: `{ uploadUrl, fileUrl }` — same keys as current S3 response so it's a drop-in if any future client uses this endpoint
- Read credentials from `config` (`CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`) — already wired
- Update `.env.example` to document Cloudinary vars; remove S3/AWS vars

### Acceptance criteria
- `npm run build` in `sultan-bazar-server/` passes (no TS errors)
- No `@aws-sdk` imports anywhere in `src/`
- Route `POST /api/v1/uploads/generate-upload-url` returns a valid Cloudinary upload URL (manual curl test)

### Verification
1. `npm run build` in `sultan-bazar-server/` passes
2. `grep -r "@aws-sdk" sultan-bazar-server/src` returns empty

---

## Task 4 — Environment variable documentation and config update

**Files:**
- `sultan-bazar-client/.env` (add new vars, remove imgBB key)
- `sultan-bazar-server/.env.example` (already updated in Task 3)
- `sultan-bazar-server/package.json` lockfile update

### Client env vars to add
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

### Client env vars to remove
```
NEXT_PUBLIC_IMGBB_API_KEY   ← delete
```

### Acceptance criteria
- `sultan-bazar-client/.env` has the two new Cloudinary vars and no imgBB key
- `sultan-bazar-server/.env.example` documents `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` and has no AWS vars

---

## Task 5 — Delete imgBB helper and final cleanup

**Files:**
- `sultan-bazar-client/helpers/imgbb.uploads.ts` → **delete**

### Acceptance criteria
- File no longer exists
- `grep -r "imgbb" sultan-bazar-client/` returns empty
- `npm run build` in both client and server passes

### Verification
1. Both builds pass
2. No remaining `imgbb` references anywhere in the repo

---

## Checkpoint: before beginning Task 3

Before rewriting the server, confirm:
- Cloudinary account exists and cloud name / API key / secret are available
- An **unsigned upload preset** has been created in the Cloudinary dashboard for client-side uploads (Tasks 1–2)
- Optionally: a separate folder per preset (`products/`, `categories/`, `avatars/`) is configured in the preset

---

## What is NOT in scope

- Migrating existing imgBB URLs already stored in the database — out of scope for this change set; images stored as imgBB URLs continue to render via Next.js `<Image>` (wildcard `hostname: "**"` is already set in `next.config.ts`)
- Adding Cloudinary image transformation params to existing `<Image>` src URLs — Phase 6 (performance)
- Changing the Next.js `remotePatterns` config — already uses `hostname: "**"`, which covers Cloudinary
