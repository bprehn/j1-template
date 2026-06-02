# Page-by-Page Rebuild Playbook

Use this workflow to rebuild public pages from scratch while optimizing includes safely.

## Goals

- Rebuild each page cleanly using current site architecture.
- Move assets into final typed folders before publishing.
- Reduce include duplication and complexity without regressions.

## Source Paths You Will Use Most

- Page source roots:
  - pages/public
- Include roots:
  - _includes/themes
  - _includes/custom
- Layout roots:
  - _layouts
- Asset roots:
  - assets/image
  - assets/video
  - assets/audio
  - assets/custom

## Recommended Order

1. Pick one page and freeze scope.
2. Rebuild page content using existing section templates and includes.
3. Move and relink assets to final locations.
4. Validate that page only.
5. Optimize includes touched by that page.
6. Re-test page and related templates.
7. Mark done and move to next page.

## Per-Page Execution Checklist

1. Baseline
- Capture old URL and intended new URL.
- Screenshot old page sections for parity.
- List required features on the page (forms, maps, embeds, CTAs).

2. Rebuild
- Create new page file in pages/public using current frontmatter style.
- Assemble page with reusable includes where possible.
- Avoid direct copy of old HTML blocks unless cleaned.

3. Asset Placement
- Hero and campaign images: assets/image/banner
- Page-specific images: assets/image/page
- Reusable shared graphics: assets/image/module
- Icons and logos: assets/image/icon
- Backgrounds: assets/image/background
- Video and audio: assets/video and assets/audio
- Temporary intake only: assets/uploads, then promote to final folders

4. Link and SEO Checks
- Internal links resolve.
- No old domain links remain unless intentional.
- Title, description, canonical, robots are set as needed.

5. Include Optimization Pass
- Remove dead include parameters.
- Consolidate repeated include blocks into one include with options.
- Keep include names and argument shapes consistent.
- Do not optimize unrelated includes in the same commit.

6. Validation
- Full build passes.
- Page renders correctly on desktop and mobile.
- No missing assets or console errors on key interactions.
- Navigation and quicklinks still behave as expected.

## Include Optimization Rules

- Optimize only includes touched by the current page wave.
- Change one include family at a time.
- Preserve public include interfaces unless all callers are updated.
- Add brief comments only where logic is not obvious.

## Suggested Wave Plan

- Wave 1: Revenue and operations pages.
- Wave 2: Information and evergreen pages.
- Wave 3: Long-tail and archive pages.

## Definition of Done for One Page

- New page is complete and visually acceptable.
- Assets are in final folders and linked by site-root paths.
- Include usage is simplified where touched.
- QA checklist passes.
- Page is logged as complete in the migration worksheet.
