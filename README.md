# Aderonke Wellness — static build (Netlify)

A parallel version of the WordPress rebuild in the sibling `ADERONKE` project, built as a static site with [Astro](https://astro.build), so it can deploy to Netlify. See the [rebuild plan](https://claude.ai/artifact/2Tng4zR51xqDrCMe1cnU8j) for the full context.

**This exists because Netlify cannot run the WordPress build.** Netlify hosts static files and small serverless functions — it has no PHP runtime and no database, both of which WordPress requires. This project is the same design system and the same 9 Phase 2 articles, rebuilt from scratch as plain HTML/CSS that Netlify *can* serve.

## What's different from the WordPress version

| | WordPress (`../ADERONKE`) | This project |
| --- | --- | --- |
| Editing | Aderonke edits posts/pages in wp-admin | Edit markdown files in `src/content/articles/` and `.astro` page files, then commit + push |
| Contact form | PHP handler (`admin-post.php`) | [Netlify Forms](https://docs.netlify.com/forms/setup/) — no backend code, Netlify auto-detects the form at deploy time |
| Newsletter | Posts to Kit via a PHP template conditional | Same Kit endpoint, posts directly from the static form; set `PUBLIC_KIT_FORM_ID` as a Netlify environment variable |
| Hosting | Any PHP + MySQL host | Netlify (or any static host) |
| New content | Write a post in wp-admin | Add a markdown file to `src/content/articles/`, run `npm run build`, deploy |

## Project structure

```
src/
  content/articles/*.md     The 9 articles, as Astro content collection entries
  content.config.ts         Schema for the articles collection
  components/                Header, Footer, ArticleCard, AuthorBox, Disclaimer
  layouts/BaseLayout.astro  Shared page shell (head, nav, footer, JSON-LD)
  pages/
    index.astro              Home
    mental-wellness/, dementia-care/, caregiver-support/   Pillar hub pages
    [pillar]/[slug].astro    Article template (one route, all 9 articles)
    about.astro, contact.astro, editorial-policy.astro, disclaimer.astro,
    resources.astro, privacy-policy.astro
  styles/global.css          Same design tokens as the WordPress theme's style.css
scripts/port-content.mjs     One-off script that ported the 9 articles from
                              ../ADERONKE/content/articles/ into src/content/articles/
```

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Deploying to Netlify

1. Push this folder to its own GitHub repo (or connect Netlify directly to a monorepo subdirectory with a **Base directory** setting).
2. In Netlify: **Add new site > Import an existing project**, point it at the repo.
3. Build settings are already in `netlify.toml` (`npm run build`, publish `dist`) — Netlify should detect them automatically.
4. Once deployed, go to **Site configuration > Environment variables** and add `PUBLIC_KIT_FORM_ID` with the real Kit form ID (find it in Kit under Grow > Landing Pages & Forms > your form > Embed) to make the newsletter form live. Leave it unset and the homepage shows a clear "not connected yet" message instead of a dead form.
5. Contact form submissions appear automatically under **Forms** in the Netlify dashboard once the site is deployed — no setup needed beyond what's already in `src/pages/contact.astro`.

## Known gaps vs. the WordPress version

- **No live editing.** Every content change is a file edit + git commit + Netlify auto-deploy, not a wp-admin save. This is the fundamental tradeoff of static vs. WordPress — see the rebuild plan's original Phase 1 decision on why WordPress was chosen first.
- **Privacy Policy is a placeholder** (same gap as the WordPress version — the original site's legal copy was never captured).
- **Social share icons are omitted** — no real profile URLs are configured yet, same "don't link to nowhere" rule as the WordPress build.
- **Amazon affiliate link helper** (built in the WordPress theme's `template-helpers.php`) wasn't ported here — add it as a small Astro utility if/when affiliate links are actually added to an article.
