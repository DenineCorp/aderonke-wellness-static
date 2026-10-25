// One-off content port: reads the Phase 2 article markdown files from the
// sibling WordPress project (../ADERONKE/content/articles/) and the
// ADERONKE repo's working copy, strips the authoring HTML-comment block
// and the H1 title line, and writes each out as an Astro content
// collection entry with frontmatter. Run with: node scripts/port-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, '..', '..', 'ADERONKE', 'content', 'articles');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'content', 'articles');

fs.mkdirSync(OUT_DIR, { recursive: true });

// key (source filename without .md) -> { pillar, pubDate }
// Dates follow content-calendar.md's weeks 5-10 staggered schedule, so the
// demo actually shows what "don't batch-publish" looks like.
const MANIFEST = {
	'mental-wellness-recognizing-depression-in-older-adults': { pillar: 'mental-wellness', pubDate: '2026-10-27' },
	'dementia-care-apathy-in-dementia-guide': { pillar: 'dementia-care', pubDate: '2026-10-29' },
	'caregiver-support-caregiver-burnout-warning-signs': { pillar: 'caregiver-support', pubDate: '2026-10-31' },
	'dementia-care-therapeutic-fibbing': { pillar: 'dementia-care', pubDate: '2026-11-03' },
	'caregiver-support-siblings-not-helping': { pillar: 'caregiver-support', pubDate: '2026-11-05' },
	'mental-wellness-loneliness-health-risk': { pillar: 'mental-wellness', pubDate: '2026-11-10' },
	'dementia-care-three-stages-of-dementia': { pillar: 'dementia-care', pubDate: '2026-11-12' },
	'caregiver-support-respite-care-101': { pillar: 'caregiver-support', pubDate: '2026-11-17' },
	'mental-wellness-hearing-loss-dementia-risk': { pillar: 'mental-wellness', pubDate: '2026-11-19' },
};

function yamlEscape(s) {
	return s.replace(/"/g, '\\"');
}

for (const [key, meta] of Object.entries(MANIFEST)) {
	const srcPath = path.join(SRC_DIR, `${key}.md`);
	let text = fs.readFileSync(srcPath, 'utf8');

	// Pull the meta description out of the authoring comment, and the H1 title.
	const descMatch = text.match(/Meta description:\s*([\s\S]*?)\n(?:-->|Week \d)/);
	const description = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '';

	// Strip the leading HTML comment.
	text = text.replace(/^\s*<!--[\s\S]*?-->\s*/, '');

	const lines = text.split('\n');
	let i = 0;
	while (i < lines.length && lines[i].trim() === '') i++;
	const titleLine = lines[i];
	const title = titleLine.replace(/^#\s+/, '').trim();
	lines.splice(i, 1);
	const body = lines.join('\n').trim();

	const frontmatter = [
		'---',
		`title: "${yamlEscape(title)}"`,
		`description: "${yamlEscape(description)}"`,
		`pillar: "${meta.pillar}"`,
		`pubDate: ${meta.pubDate}`,
		`updatedDate: ${meta.pubDate}`,
		'author: "Aderonke Agboji"',
		'credentials: "RN, PhD Candidate"',
		'---',
		'',
	].join('\n');

	fs.writeFileSync(path.join(OUT_DIR, `${key}.md`), frontmatter + body + '\n');
	console.log(`Wrote ${key}.md (${meta.pillar}, ${meta.pubDate})`);
}
