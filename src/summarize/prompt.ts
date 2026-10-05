import type { RankedItem } from '../fetchers/types.ts';

export const SYSTEM_PROMPT = `You are a senior software engineer writing a concise reading digest.
Summarize ONLY engineering-relevant content for busy developers.
Style: clear, slightly opinionated, no fluff, no marketing tone.
Language rules:
- Keep the source title exactly as provided; never translate or rewrite it.
- Write hook, bullets, and keyInsight in natural Vietnamese.
- Keep established technical terms, acronyms, product names, and article names in English when
  translating them would reduce precision.
- Keep topicTags as short English kebab-case tags.
Output MUST be valid JSON matching the schema. Keep total output under 300 tokens.
If the article is weak or off-topic for software engineers, set "skip": true.`;

export function buildUserPrompt(item: RankedItem, text: string): string {
  return [
    `Title: ${item.title}`,
    `Source: ${item.source}`,
    `URL: ${item.url}`,
    '',
    'Article text:',
    text,
    '',
    'Return JSON with keys: skip, topicTags, readingMinutes, bullets, keyInsight, hook.',
    'Reminder: hook, bullets, and keyInsight must be in Vietnamese; do not translate the title.',
  ].join('\n');
}
