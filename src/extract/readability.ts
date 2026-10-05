import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import type { RawItem } from '../fetchers/types.ts';
import { fetchText } from '../util/http.ts';

export interface ExtractResult {
  ok: boolean;
  text: string;
  wordCount: number;
}

function normalizeText(input: string): string {
  return input.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}\n…`;
}

function feedText(item: RawItem): string {
  const html = item.rawContent || item.snippet || '';
  const dom = new JSDOM(`<body>${html}</body>`);
  return normalizeText(dom.window.document.body.textContent ?? '');
}

export async function extractArticle(
  item: RawItem,
  truncateChars: number,
): Promise<ExtractResult> {
  if (item.contentMode === 'feed') {
    const text = truncate(feedText(item), truncateChars);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return wordCount >= 25
      ? { ok: true, text, wordCount }
      : { ok: false, text: '', wordCount: 0 };
  }

  try {
    const html = await fetchText(item.url, { timeoutMs: 12_000 });
    const dom = new JSDOM(html, { url: item.url });
    const article = new Readability(dom.window.document).parse();
    const text = normalizeText(article?.textContent ?? '');
    if (text.split(/\s+/).filter(Boolean).length >= 80) {
      const clipped = truncate(text, truncateChars);
      return {
        ok: true,
        text: clipped,
        wordCount: clipped.split(/\s+/).filter(Boolean).length,
      };
    }
  } catch (err) {
    console.warn(`extract failed for ${item.id}:`, err);
  }

  const fallback = normalizeText(item.rawContent || item.snippet || '');
  if (fallback.split(/\s+/).filter(Boolean).length >= 40) {
    const clipped = truncate(fallback, truncateChars);
    return {
      ok: true,
      text: clipped,
      wordCount: clipped.split(/\s+/).filter(Boolean).length,
    };
  }

  return { ok: false, text: '', wordCount: 0 };
}
