#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$ROOT_DIR/packages/400_theme_site"

printf "\n[1/8] Running base setup (yarn setup) ...\n"
if ! (cd "$ROOT_DIR" && yarn setup); then
  printf "setup reported errors; continuing with macOS compatibility steps.\n"
fi

printf "\n[2/8] Recreating site symlinks (skip missing apps link) ...\n"
(
  cd "$SITE_DIR"
  yarn run remove-links
  rm -rf _sass
  ln -s ../300_theme_src/assets ./assets
  ln -s ../300_theme_src/_includes ./_includes
  ln -s ../300_theme_src/_layouts ./_layouts
  ln -s ../300_theme_src/_plugins ./_plugins
  ln -s ../100_theme_css/scss ./_sass
  ln -s ../300_theme_src/_install ./_install
)

printf "\n[3/8] Ensuring csv gem is available on Ruby 3.4 ...\n"
GEMFILE="$SITE_DIR/Gemfile"
if grep -q "RUBY_VERSION =~ /3.3/" "$GEMFILE"; then
  sed -i '' 's/RUBY_VERSION =~ \/3\.3\//RUBY_VERSION =~ \/3\\.[34]\//g' "$GEMFILE"
fi

printf "\n[4/8] Building and deploying CSS assets ...\n"
(
  cd "$ROOT_DIR"
  npm --prefix packages/100_theme_css run build
  npm --prefix packages/100_theme_css run deploy
)

printf "\n[5/8] Installing Ruby gems for site package ...\n"
(
  cd "$SITE_DIR"
  bundle install
)

printf "\n[6/8] Pre-building site output (_site) ...\n"
(
  cd "$SITE_DIR"
  bundle exec jekyll b -c _config.yml --incremental
)

printf "\n[7/8] Verifying Jekyll command works ...\n"
(
  cd "$SITE_DIR"
  bundle exec jekyll -v
)

printf "\n[8/8] Done. Start development server with:\n"
printf "cd %s && yarn site\n" "$ROOT_DIR"
