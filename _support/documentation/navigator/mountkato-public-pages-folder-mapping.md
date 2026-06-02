# Mount Kato Public Pages Migration Mapping

This mapping is tailored to the current repo structure and should be used as the source of truth during migration.

## 1) Page Destination Mapping

- Homepage and major landing pages:
  - Source authoring path: pages/public
  - Example sections: pages/public/about, pages/public/features, pages/public/learn, pages/public/manual, pages/public/legal
- Repeating content sets (team, portfolio, narrative collections):
  - Source authoring path: collections
  - Existing collection roots: collections/_people, collections/_portfolio, collections/_biography, collections/_fantasy, collections/_romance

## 2) Asset Destination Mapping

- Stable production images:
  - Root: assets/image
  - Place by intent:
    - assets/image/page for page-specific graphics
    - assets/image/post for article graphics
    - assets/image/banner for hero and campaign banners
    - assets/image/module for module-level assets used by shared components
    - assets/image/icon for logos and iconography
    - assets/image/background for section and site backgrounds
    - assets/image/collection for collection entry media
- Video and audio:
  - Video root: assets/video
  - Audio root: assets/audio
- CMS upload intake:
  - Temporary intake path: assets/uploads
  - Promote finalized assets from uploads to permanent typed folders above
- Custom one-off files:
  - assets/custom/content

## 3) Naming Rules (Optimization-safe)

- Use lowercase and hyphenated file names.
- Keep names stable once referenced in published pages.
- Prefer semantic names over date-only names.
- Avoid spaces and special characters.

## 4) Efficient Migration Workflow (Wave-by-wave)

1. Inventory old URLs and classify each URL as keep, merge, retire, or redirect.
2. Add each URL to the CSV worksheet and assign wave and priority.
3. Migrate content files first into pages/public or collections.
4. Move/optimize assets into final typed folders.
5. Update internal links to new paths.
6. Add redirect rules for all changed URLs.
7. Run full build and QA checks for links, images, metadata, and mobile layout.
8. Publish one wave at a time.

## 5) Redirect and QA Minimums

- Every old public URL must have one of:
  - a new destination URL
  - a 301 redirect target
  - explicit retirement approval
- QA checklist per migrated page:
  - content parity with old page
  - working links/buttons
  - media loads from final paths
  - title/description/canonical present
  - mobile viewport verification
  - no console errors on key interactions

## 6) Immediate Next Actions

1. Fill the worksheet with top 25 old URLs first.
2. Execute Wave 1 migration for P0 URLs only.
3. Run full rebuild and validate on local server before merging.
