# Mountain Biking Page Migration Package

This package contains everything needed to migrate:

- `pages/public/mountain/mountain-biking/mountain-biking.adoc`

to a J1 project that uses SwiperJS instead of the legacy J1 carousel module.

## Package Structure

- `payload/` copied source files and assets
- `payload/pages/public/mountain/mountain-biking/mountain-biking-swiper.adoc` Swiper-ready page variant
- `payload/pages/public/mountain/mountain-biking/mountain-biking-content-only.adoc` content block for template merge
- `payload/_includes/swiper/mbt-maps-swiper.html` Swiper include replacing `carousel::mbt_maps[...]`
- `payload/assets/css/custom/mbt-maps-swiper.css` Swiper styling for this page
- `merge-with-template.sh` helper script to combine your target template with the content block

## What Changed For Swiper

The line below from the original page:

`carousel::mbt_maps[role="mb-5"]`

was replaced in `mountain-biking-swiper.adoc` with:

```liquid
++++
{% include swiper/mbt-maps-swiper.html %}
++++
```

## Required In Target Project

1. Swiper CSS/JS must be loaded globally or on this page.
2. Copy `payload/assets/css/custom/mbt-maps-swiper.css` into your target and import it in your custom styles pipeline.
3. Use `mountain-biking-swiper.adoc` as the migrated page file.

## Use Your New simple.adoc Template

If your target project has this template:

- `packages/400_theme_site/pages/public/asciidoc_skeletons/simple-document/simple.adoc`

you can generate a page that keeps its front matter/header and injects the migrated content:

```bash
# run from target project root after copying this package over
bash migration-packages/mountain-biking-page/merge-with-template.sh \
	packages/400_theme_site/pages/public/asciidoc_skeletons/simple-document/simple.adoc \
	migration-packages/mountain-biking-page/payload/pages/public/mountain/mountain-biking/mountain-biking-content-only.adoc \
	pages/public/mountain/mountain-biking/mountain-biking.adoc
```

This creates `pages/public/mountain/mountain-biking/mountain-biking.adoc` with your new template header and the migrated Swiper-ready content body.

## Important Missing Asset

`/assets/video/MTB_tickets.mp4` is referenced by the page but is not present in this repository package.

You must provide this file manually in the target project or change/remove this line in the page:

`video::/assets/video/MTB_tickets.mp4[poster=/assets/image/MTB_tickets.jpeg]`

## Suggested Copy Flow

From this repository root:

```bash
# Example target project path
TARGET="/path/to/jekyll-one/j1-template-clean-og"

# Copy everything in the package payload
rsync -av migration-packages/mountain-biking-page/payload/ "$TARGET"/
```

Then in the target project, set the page file to:

- `pages/public/mountain/mountain-biking/mountain-biking-swiper.adoc`

(or rename it back to `mountain-biking.adoc` after verification).
