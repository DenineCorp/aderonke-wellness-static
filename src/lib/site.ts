import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * True unless PUBLIC_SITE_STAGE is explicitly set to "production" (set
 * this in Netlify's environment variables once the site is ready for
 * real visitors and search engines). Defaults to preview mode so a
 * forgotten env var fails safe: banner + noindex stay on rather than a
 * half-finished site going fully public and indexable by accident.
 */
export const isPreview = import.meta.env.PUBLIC_SITE_STAGE !== 'production';

/**
 * Articles whose pubDate has actually arrived. A static site has no way
 * to "unlock" a post at midnight on its own — publishing on the
 * schedule in content-calendar.md means rebuilding and redeploying on
 * or after each date, the same discipline the WordPress version's
 * post-scheduler enforces automatically.
 */
export async function getPublishedArticles(): Promise<CollectionEntry<'articles'>[]> {
	const now = new Date();
	const all = await getCollection('articles', (entry) => entry.data.pubDate <= now);
	return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
