# Todo: imgBB → Cloudinary Migration

## Task 1 — Create Cloudinary client upload helper
- [x] Create `sultan-bazar-client/helpers/cloudinary.uploads.ts`
  - [x] Move compression function with per-preset dimensions (product 1000px/200KB, category 800px/150KB, avatar 400px/80KB)
  - [x] Implement `uploadToCloudinary(file, preset)` using Cloudinary unsigned upload API
  - [x] Read `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` from env
  - [x] TypeScript compiles clean (client build ✅)

## Task 2 — Update all three callers
- [x] `product.modal.tsx`: replaced `uploadToImgBB` → `uploadToCloudinary(file, 'product')`
- [x] `category.modal.tsx`: replaced `uploadToImgBB` → `uploadToCloudinary(file, 'category')`
- [x] `ProfileUpdateModal.tsx`: replaced `uploadToImgBB` → `uploadToCloudinary(file, 'avatar')`
- [x] `npm run build` in client passes ✅
- [x] `grep -r "imgbb"` returns empty ✅

## Task 3 — Rewrite server upload controller to Cloudinary
- [x] Added `cloudinary` to `sultan-bazar-server/package.json`
- [x] Removed `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
- [x] Rewrote `controller.upload.ts` to use Cloudinary signed upload params
- [x] `npm run build` in server passes ✅
- [x] `grep -r "@aws-sdk" sultan-bazar-server/src` returns empty ✅

## Task 4 — Env var documentation
- [x] Added `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` to `sultan-bazar-client/.env`
- [x] Removed `NEXT_PUBLIC_IMGBB_API_KEY`, `CLOUDE_NAME`, `CLOUDE_API_KEY`, `CLOUDE_API_SECRET` from client `.env` (secrets moved to server)
- [x] Added `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` to `sultan-bazar-server/.env`
- [x] Updated `sultan-bazar-server/.env.example` with Cloudinary vars

## Task 5 — Delete imgBB helper and final cleanup
- [x] Deleted `sultan-bazar-client/helpers/imgbb.uploads.ts`
- [x] `grep -r "imgbb" sultan-bazar-client/` returns empty ✅
- [x] Both client and server `npm run build` pass ✅
- [ ] Commit all changes (pending user confirmation)

## ⚠ One manual step required before testing
Create an **unsigned upload preset** named `sultan_bazar_unsigned` in the Cloudinary dashboard:
- Settings → Upload → Upload Presets → Add upload preset
- Signing mode: **Unsigned**
- Folder: `sultan-bazar` (optional but recommended)
- Save
